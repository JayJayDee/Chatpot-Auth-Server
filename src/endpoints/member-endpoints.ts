import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';

export const getMember = (): Endpoint => ({
  uri: '/:member_no',
  method: EndpointMethod.GET,
  handler: [async (req, res, next) => {
    const dummy = 'server success';
    res.status(200).json({ dummy });
  }]
});

injectable(Modules.Endpoint.Member.Get,
  [],
  async () => getMember());

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