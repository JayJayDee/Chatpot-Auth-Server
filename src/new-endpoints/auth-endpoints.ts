import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';

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
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/auth',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync((req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Auth.Reauth,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/auth/reauth',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync((req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));