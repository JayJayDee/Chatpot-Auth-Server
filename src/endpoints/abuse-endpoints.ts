import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';
import { UtilModules, UtilTypes } from '../utils';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';

injectable(EndpointModules.Abuse.ReportUser,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Abuse.ReportAbuser,
    UtilModules.Auth.DecryptMemberToken,
    UtilModules.Auth.DecryptRoomToken,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    reportAbuser: ServiceTypes.ReportAbuser,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    decryptRoomToken: UtilTypes.Auth.DecryptRoomToken,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/abuse/report',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['body', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.body['member_token'];
        const targetToken = req.body['target_token'];
        const roomToken = req.body['room_token'];
        const comment = req.body['comment'];

        if (!memberToken) throw new InvalidParamError('member_token required');
        if (!targetToken) throw new InvalidParamError('target_token required');
        if (!roomToken) throw new InvalidParamError('room_token required');

        const reporter = decryptMemberToken(memberToken);
        const target = decryptMemberToken(targetToken);
        const room = decryptRoomToken(roomToken);

        if (reporter === null) throw new InvalidParamError('invalid member_token');
        if (target === null) throw new InvalidParamError('invalid target_token');
        if (room === null) throw new InvalidParamError('invalid room_token');

        await reportAbuser({
          comment,
          reporter_no: reporter.member_no,
          target_no: target.member_no,
          room_token: roomToken
        });
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Abuse.GetReports,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/abuse/:member_token/reports',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));