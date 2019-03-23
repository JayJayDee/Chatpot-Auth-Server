import { Endpoint, EndpointMethod, EndpointRouter, Authenticator } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';
import { Logger } from '../loggers/types';
import { ServiceTypes } from '../services/types';
import { InvalidParamError } from './errors';
import { asyncEndpointWrap } from './wraps';

injectable(Modules.Endpoint.Member.CreateEmail,
  [ Modules.Service.Member.Create ],
  async (create: ServiceTypes.CreateMember): Promise<Endpoint> =>

  ({
    uri: '/email',
    method: EndpointMethod.POST,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const email = req.body['email'];
        const password = req.body['password'];
        const region = req.body['region'];
        const language = req.body['language'];
        const gender = req.body['gender'];

        if (!email || !password || !region || !language || !gender) {
          throw new InvalidParamError('email, password, region, language, gender required');
        }

        const auth = {
          auth_type: ServiceTypes.AuthType.EMAIL,
          login_id: email,
          password
        };

        const param = { region, language, gender, auth };
        const resp = await create(param);
        res.status(200).json(resp);
      })
    ]
  }));

export const getMember =
  (getMember: ServiceTypes.FetchMember,
    authenticator: Authenticator): Endpoint => ({
    uri: '/:token',
    method: EndpointMethod.GET,
    handler: [
      authenticator(['params', 'token']),
      asyncEndpointWrap(async (req, res, next) => {
        const token: string = req.params['token'];
        if (!token) throw new InvalidParamError('token');
        const member = await getMember(token);
        res.status(200).json(member);
      })
    ]
  });
injectable(Modules.Endpoint.Member.Get,
  [Modules.Service.Member.Fetch,
    Modules.Endpoint.Middleware.Authenticator],
  async (fetch, auth) => getMember(fetch, auth));

export const joinSimple =
  (log: Logger,
    create: ServiceTypes.CreateMember): Endpoint => ({
      uri: '/',
      method: EndpointMethod.POST,
      handler: [
        asyncEndpointWrap(async (req, res, next) => {
          if (!req.body['region'] || !req.body['language'] || !req.body['gender']) {
            throw new InvalidParamError('region, language, gender');
          }
          const region = req.body['region'];
          const language = req.body['language'];
          const gender = req.body['gender'];
          const auth = {
            auth_type: ServiceTypes.AuthType.SIMPLE
          };

          const param = { region, language, gender, auth };
          const resp = await create(param);
          res.status(200).json(resp);
        })
      ]
    });
injectable(Modules.Endpoint.Member.Create,
  [Modules.Logger,
    Modules.Service.Member.Create],
  async (log, create) => joinSimple(log, create));

injectable(Modules.Endpoint.Member.Router,
  [ Modules.Endpoint.Member.Get,
    Modules.Endpoint.Member.Create,
    Modules.Endpoint.Member.CreateEmail ],
  async (get: Endpoint, create: Endpoint, email: Endpoint): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ get, create, email ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/member' };
  });