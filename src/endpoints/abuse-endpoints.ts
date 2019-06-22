import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';
import { UtilModules, UtilTypes } from '../utils';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { StoreModules, StoreTypes } from '../stores';

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
        const reportType = req.body['report_type'];
        const memberToken = req.body['member_token'];
        const targetToken = req.body['target_token'];
        const roomToken = req.body['room_token'];
        const comment = req.body['comment'];

        if (!reportType) throw new InvalidParamError('report_type required');
        if (!memberToken) throw new InvalidParamError('member_token required');
        if (!targetToken) throw new InvalidParamError('target_token required');
        if (!roomToken) throw new InvalidParamError('room_token required');

        const reporter = decryptMemberToken(memberToken);
        const target = decryptMemberToken(targetToken);
        const room = decryptRoomToken(roomToken);

        if (reporter === null) throw new InvalidParamError('invalid member_token');
        if (target === null) throw new InvalidParamError('invalid target_token');
        if (room === null) throw new InvalidParamError('invalid room_token');

        const report_type = cvtToReportType(reportType);
        if (!report_type) {
          throw new InvalidParamError('report_type must be HATE or SEXUAL or ETC');
        }

        await reportAbuser({
          comment,
          report_type,
          reporter_no: reporter.member_no,
          target_no: target.member_no,
          room_token: roomToken
        });
        res.status(200).json({});
      })
    ]
  }));

const cvtToReportType = (inputed: any): ServiceTypes.ReportType =>
  inputed === 'HATE' ? ServiceTypes.ReportType.HATE :
  inputed === 'SEXUAL' ? ServiceTypes.ReportType.SEXUAL :
  inputed === 'ETC' ? ServiceTypes.ReportType.ETC : null;

injectable(EndpointModules.Abuse.GetReports,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    StoreModules.Abuse.GetReportStatuses,
    UtilModules.Auth.DecryptMemberToken ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    getReportStatuses: StoreTypes.Abuse.GetReportStatuses,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/abuse/:member_token/reports',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];

        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMemberToken(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const statuses = await getReportStatuses({ member_no: member.member_no });
        res.status(200).json(statuses.map((s) => {
          s.content = JSON.parse(s.content);
          return s;
        }));
      })
    ]
  }));