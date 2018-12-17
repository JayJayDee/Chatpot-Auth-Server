import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';
import { Member, Nick } from '../stores/types';
import { Logger } from '../loggers/types';
import { MemberService } from '../services/types';

export const getMember = 
  (memberGet: Member.GetMember, pickNick: Nick.PickNick): Endpoint => ({
    uri: '/:member_no',
    method: EndpointMethod.GET,
    handler: [
      async (req, res, next) => {
        const member = await memberGet(1);
        const nick = await pickNick();
        res.status(200).json({ member, nick });
      }
    ]
  });

export const joinSimple =
  (log: Logger,
    create: MemberService.CreateMember): Endpoint => ({
      uri: '/',
      method: EndpointMethod.POST,
      handler: [
        async (req, res, next) => {
          const param = {
            region: 'KR',
            language: 'ko',
            gender: 'M'
          };
          const resp = await create(param);
          res.status(200).json(resp);
        }
      ]
    });

injectable(Modules.Endpoint.Member.Get,
  [Modules.Store.Member.Get,
    Modules.Store.Nick.Pick],
  async (memberGet, pickNick: Nick.PickNick) =>
    getMember(memberGet, pickNick));

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