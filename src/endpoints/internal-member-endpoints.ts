import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { Router } from 'express';
import { MemberService } from '../services/types';
import { asyncEndpointWrap } from './wraps';
import { InvalidParamError } from './errors';
import { isArray } from 'util';

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
        const tokens: any = req.query.tokens;
        const memberStrNos: any = req.query.member_nos;
        let resp: any = null;

        if (!tokens && !memberStrNos) {
          throw new InvalidParamError('token or member_nos');
        }

        if (tokens) {
          if (isArray(tokens) === true) {
            resp = await fetchMultipleToken(tokens);
          } else {
            resp = await fetchMultipleToken([ tokens ]);
          }
        }

        else if (memberStrNos) {
          try {
            if (isArray(memberStrNos) === true) {
              const memberNos: number[] = memberStrNos.map((m: string) => parseInt(m));
              resp = await fetchMultiple(memberNos);
            } else {
              resp = await fetchMultiple([ parseInt(memberStrNos) ]);
            }
          } catch (err) {
            // TODO: array-single conversion.
          }
        }
        res.status(200).json(resp);
      })
    ]
  }));