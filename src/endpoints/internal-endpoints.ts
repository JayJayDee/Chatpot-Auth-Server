import { injectable } from 'smart-factory';
import { isArray } from 'util';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';

injectable(EndpointModules.Internal.GetMultiple,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.FetchMultiple ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    fetchMultiple: ServiceTypes.FetchMembers): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/internal/member',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync(async (req, res, next) => {
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