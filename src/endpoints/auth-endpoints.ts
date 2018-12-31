import { Modules } from '../modules';
import { EndpointRouter, Endpoint, EndpointMethod } from './types';
import { Router } from 'express';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';
import { MemberService } from '../services/types';
import { asyncEndpointWrap } from './wraps';
import { InvalidParamError } from './errors';

injectable(Modules.Endpoint.Auth.Router,
  [Modules.Endpoint.Auth.Auth],
  async (auth): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ auth ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/auth' };
  });

const authEndpoint =
  (log: Logger,
    auth: MemberService.Authenticate): Endpoint => ({
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
    Modules.Service.Member.Authenticate],
  async (log, auth) => authEndpoint(log, auth));
