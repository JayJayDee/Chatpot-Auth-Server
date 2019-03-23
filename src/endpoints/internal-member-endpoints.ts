import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Endpoint, EndpointMethod, EndpointRouter } from './types';
import { Router } from 'express';
import { ServiceTypes } from '../services/types';
import { asyncEndpointWrap } from './wraps';
import { InvalidParamError } from './errors';
import { isArray } from 'util';
import { ServiceModules } from '../services';

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
  [ServiceModules.Member.FetchMultiple],
  async (fetchMultiple: ServiceTypes.FetchMembers): Promise<Endpoint> => ({
    uri: '/member',
    method: EndpointMethod.GET,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        let memberStrNos: string[] | string = req.query.member_nos;
        const memberNo: string = req.query.member_no;
        let memberNos: number[] = null;
        let multiple = true;

        if (!memberStrNos && !memberNo) {
          throw new InvalidParamError('member_nos or member_no');
        }

        if (memberStrNos) {
          multiple = true;
          if (isArray(memberStrNos) === false) memberStrNos = [ memberStrNos as string ];
          try {
            memberNos = (memberStrNos as string[]).map((m) => parseInt(m));
          } catch (err) {
            throw new InvalidParamError('member_nos array elements must be number');
          }
        }

        if (memberNo) {
          multiple = false;
          try {
            memberNos = [ parseInt(memberNo) ];
          } catch (err) {
            throw new InvalidParamError('member_no must be number');
          }
        }

        const members = await fetchMultiple(memberNos);
        if (multiple === true) res.status(200).json(members);
        else if (multiple === false) res.status(200).json(members[0]);
      })
    ]
  }));