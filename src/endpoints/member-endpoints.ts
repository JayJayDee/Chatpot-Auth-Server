import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';
import { Logger } from '../loggers/types';
import { MemberService } from '../services/types';
import { InvalidParamError } from './errors';
import { asyncEndpointWrap } from './wraps';

export const getMember = 
  (getMember: MemberService.FetchMember): Endpoint => ({
    uri: '/:token',
    method: EndpointMethod.GET,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const token: string = req.params['token'];
        if (!token) throw new InvalidParamError('token');
        const member = await getMember(token)
        res.status(200).json(member);
      })
    ]
  });

export const joinSimple =
  (log: Logger,
    create: MemberService.CreateMember): Endpoint => ({
      uri: '/',
      method: EndpointMethod.POST,
      handler: [
        asyncEndpointWrap(async (req, res, next) => {
          const param = {
            region: 'KR',
            language: 'ko',
            gender: 'M'
          };
          const resp = await create(param);
          res.status(200).json(resp);
        })
      ]
    });

injectable(Modules.Endpoint.Member.Get,
  [ Modules.Service.Member.Fetch ],
  async (fetch) => getMember(fetch));

injectable(Modules.Endpoint.Member.Create,
  [Modules.Logger,
    Modules.Service.Member.Create],
  async (log, create) => joinSimple(log, create));

injectable(Modules.Endpoint.Member.Router,
  [Modules.Endpoint.Member.Get, Modules.Endpoint.Member.Create],
  async (get: Endpoint, create: Endpoint): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ get, create ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/member' };
  });