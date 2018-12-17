import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';
import { Member, Nick } from '../stores/types';

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
  (pickNick: Nick.PickNick): Endpoint => ({
    uri: '/',
    method: EndpointMethod.POST,
    handler: [
      async (req, res, next) => {

      }
    ]
  });

injectable(Modules.Endpoint.Member.Get,
  [Modules.Store.Member.Get,
    Modules.Store.Nick.Pick],
  async (memberGet, pickNick: Nick.PickNick) =>
    getMember(memberGet, pickNick));

injectable(Modules.Endpoint.Member.Router,
  [Modules.Endpoint.Member.Get],
  async (get: Endpoint): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ get ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/member' };
  });