import { Endpoint, EndpointMethod } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Router } from 'express';

export const getMember = (): Endpoint => ({
  uri: '/:member_no',
  method: EndpointMethod.GET,
  handler: [async (req, res, next) => {
      
  }]
});

injectable(Modules.Endpoint.Member.Get,
  [],
  async () => getMember());

injectable(Modules.Endpoint.Member.Router,
  [Modules.Endpoint.Member.Get],
  async (get: Endpoint): Promise<Router> => { // TODO: to be fixed to router to uri + router
    const router = Router();
    const endpoints = [ get ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return router;
  });