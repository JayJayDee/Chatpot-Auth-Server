import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { Router } from 'express';
import { MemberService } from '../services/types';
import { asyncEndpointWrap } from './wraps';

injectable(Modules.Endpoint.Internal.Router,
  [Modules.Endpoint.Internal.Get],
  async (get: Endpoint): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ get ];
    endpoints.map((e) => {
      router[e.method].apply(router, [e.uri, e.handler]);
    });
    return {
      uri: '/internal',
      router
    };
  });

injectable(Modules.Endpoint.Internal.Get,
  [Modules.Service.Member.FetchMultipleToken,
    Modules.Service.Member.FetchMultiple],
  async (fetchMultipleToken: MemberService.FetchMembersWithToken,
      fetchMultiple: MemberService.FetchMembers): Promise<Endpoint> => ({
    uri: '/members',
    method: EndpointMethod.GET,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const tokens: string[] = req.query.tokens;
        const memberStrNos: string[] = req.query.member_nos;
        console.log(tokens);
        console.log(memberStrNos);
        res.status(200).json([]);
      })
    ]
  }));