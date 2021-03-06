import { injectable } from 'smart-factory';
import { ServiceModules } from './modules';
import { ServiceTypes } from './types';
import { StoreModules, StoreTypes } from '../stores';
import { ExtApiModules, ExtApiTypes } from '../extapis';
import { UtilModules, UtilTypes } from '../utils';
import { InvalidParamError, BaseLogicError } from '../errors';

class SelfReportError extends BaseLogicError {
  constructor() {
    super('SELF_REPORT_NOT_ALLOWED', 'you cannot report yourself');
  }
}

injectable(ServiceModules.Abuse.ReportAbuser,
  [ StoreModules.Abuse.InsertNewReport,
    ExtApiModules.Message.RequestMessages,
    UtilModules.Auth.DecryptRoomToken ],
  async (insertNewReport: StoreTypes.Abuse.InsertNewAbuse,
    requestMessages: ExtApiTypes.Message.RequestMessages,
    decryptRoomToken: UtilTypes.Auth.DecryptRoomToken): Promise<ServiceTypes.ReportAbuser> =>

    async (param) => {
      const room = decryptRoomToken(param.room_token);
      if (room === null) throw new InvalidParamError('invalid room_token');

      if (param.reporter_no === param.target_no) {
        throw new SelfReportError();
      }

      const messages = await requestMessages(param.room_token);

      await insertNewReport({
        report_type: param.report_type,
        comment: param.comment,
        room_no: room.room_no,
        reporter_no: param.reporter_no,
        target_no: param.target_no,
        content: JSON.stringify(messages)
      });
    });