import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';
import { UtilModules, UtilTypes } from '../new-utils';
import { Modules } from '../modules';
import { Auth } from '../stores/types';
import { Logger } from '../loggers/types';

injectable(EndpointModules.Auth.AuthEmail,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Authenticate ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authenticate: ServiceTypes.Authenticate): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/auth/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const login_id = req.body['login_id'];
        const password = req.body['password'];
        const auth_type = ServiceTypes.AuthType.EMAIL;

        if (!login_id || !password) throw new InvalidParamError('login_id, password');

        const resp = await authenticate({ login_id, password, auth_type });
        res.status(200).json(resp);
      })
    ]
  }));


injectable(EndpointModules.Auth.AuthSimple,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Authenticate ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authenticate: ServiceTypes.Authenticate): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/auth',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const login_id = req.body['login_id'];
          const password = req.body['password'];
          if (!login_id || !password) throw new InvalidParamError('login_id, password');
          const auth_type = ServiceTypes.AuthType.SIMPLE;

          const resp = await authenticate({ login_id, password, auth_type });
          res.status(200).json(resp);
      })
    ]
  }));


injectable(EndpointModules.Auth.Reauth,
  [ Modules.Logger,
    EndpointModules.Utils.WrapAync,
    UtilModules.Auth.DecryptMemberToken,
    Modules.Store.Auth.GetPassword,
    UtilModules.Auth.RevalidateSessionKey ],
  async (log: Logger,
    wrapAsync: EndpointTypes.Utils.WrapAsync,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    getPassword: Auth.GetPassword,
    revalidate: UtilTypes.Auth.RevalidateSessionKey): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/auth/reauth',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const token = req.body['token'];
        const oldSessionKey = req.query['session_key'];
        const inputedRefreshKey = req.query['refresh_key'];

        if (!token || !oldSessionKey || !inputedRefreshKey) {
          throw new InvalidParamError('token, session_key, refresh_key');
        }

        const member = decryptMemberToken(token);
        if (!member) throw new InvalidParamError('invalid member token');

        log.debug(`[reauth] gain token = ${token}`);
        log.debug(`[reauth] gain old_session_key = ${oldSessionKey}`);
        log.debug(`[reauth] gain refresh_key = ${inputedRefreshKey}`);

        const passwordFromDb = await getPassword(member.member_no);
        log.debug(`[reauth] gain password = ${passwordFromDb}`);

        const revalidated = revalidate({ token, oldSessionKey, passwordFromDb, inputedRefreshKey });

        res.status(200).json({
          session_key: revalidated.newSessionKey
        });
      })
    ]
  }));