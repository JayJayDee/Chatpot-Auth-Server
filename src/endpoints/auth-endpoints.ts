import { Modules } from '../modules';
import { EndpointRouter, Endpoint, EndpointMethod } from './types';
import { Router } from 'express';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';
import { ServiceTypes } from '../services/types';
import { asyncEndpointWrap } from './wraps';
import { InvalidParamError } from './errors';
import { AuthUtil } from '../utils/types';
import { Auth } from '../stores/types';
import { ServiceModules } from '../services';

injectable(Modules.Endpoint.Auth.Router,
  [Modules.Endpoint.Auth.Auth,
    Modules.Endpoint.Auth.Reauth,
    Modules.Endpoint.Auth.EmailLogin],
  async (auth, reauth, email): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ auth, reauth, email ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/auth' };
  });


injectable(Modules.Endpoint.Auth.EmailLogin,
  [ Modules.Logger,
    ServiceModules.Member.Authenticate ],
  async (log: Logger,
    auth: ServiceTypes.Authenticate): Promise<Endpoint> =>

  ({
    uri: '/email',
    method: EndpointMethod.POST,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const login_id = req.body['login_id'];
        const password = req.body['password'];
        const auth_type = Auth.AuthType.EMAIL;

        if (!login_id || !password) throw new InvalidParamError('login_id, password');

        const resp = await auth({ login_id, password, auth_type });
        res.status(200).json(resp);
      })
    ]
  }));


const authEndpoint =
  (log: Logger,
    auth: ServiceTypes.Authenticate): Endpoint => ({
      uri: '/',
      method: EndpointMethod.POST,
      handler: [
        asyncEndpointWrap(async (req, res, next) => {
          const login_id = req.body['login_id'];
          const password = req.body['password'];
          if (!login_id || !password) throw new InvalidParamError('login_id, password');

          const resp = await auth({ login_id, password });
          res.status(200).json(resp);
        })
      ]
    });
injectable(Modules.Endpoint.Auth.Auth,
  [Modules.Logger,
    ServiceModules.Member.Authenticate],
  async (log, auth) => authEndpoint(log, auth));


injectable(Modules.Endpoint.Auth.Reauth,
  [Modules.Logger,
    Modules.Util.Auth.Decrypt,
    Modules.Util.Auth.RevalidateSession,
    Modules.Store.Auth.GetPassword],
  async (log: Logger,
    decrypt: AuthUtil.DecryptToken,
    revalidate: AuthUtil.RevalidateSessionKey,
    getPassword: Auth.GetPassword): Promise<Endpoint> => ({
    uri: '/reauth',
    method: EndpointMethod.POST,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const token = req.body['token'];
        const oldSessionKey = req.query['session_key'];
        const refreshKey = req.query['refresh_key'];

        if (!token || !oldSessionKey || !refreshKey) {
          throw new InvalidParamError('token, session_key, refresh_key');
        }
        const member = decrypt(token);
        if (!member) throw new InvalidParamError('invalid token');

        log.debug(`[reauth] gain token = ${token}`);
        log.debug(`[reauth] gain old_session_key = ${oldSessionKey}`);
        log.debug(`[reauth] gain refresh_key = ${refreshKey}`);

        const storedPassword = await getPassword(member.member_no);
        log.debug(`[reauth] gain password = ${storedPassword}`);

        const newSessionKey = revalidate(token, oldSessionKey, refreshKey, storedPassword);

        res.status(200).json({
          session_key: newSessionKey
        });
      })
    ]
  }));