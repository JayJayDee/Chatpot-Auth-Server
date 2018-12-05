import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';
import { Member } from '../stores/types';

export const getMember = (memberGet: Member.GetMember): Endpoint => ({
  uri: '/:member_no',
  method: EndpointMethod.GET,
  handler: [async (req, res, next) => {
    const member = await memberGet(1);
    res.status(200).json({ member });
  }]
});

injectable(Modules.Endpoint.Member.Get,
  [Modules.Store.Member.Get],
  async (memberGet) => getMember(memberGet));

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