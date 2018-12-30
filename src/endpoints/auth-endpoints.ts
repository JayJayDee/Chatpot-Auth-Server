import { Modules } from "../modules";
import { EndpointRouter, Endpoint, EndpointMethod } from './types';
import { Router } from 'express';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';
import { MemberService } from '../services/types';
import { asyncEndpointWrap } from './wraps';

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
          res.status(200).json({});
        })
      ]
    });
injectable(Modules.Endpoint.Auth.Auth,
  [Modules.Logger,
    Modules.Service.Member.Authenticate],
  async (log, auth) => authEndpoint(log, auth));
