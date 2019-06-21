import { injectable } from 'smart-factory';
import { ServiceModules } from './modules';
import { ServiceTypes } from './types';
import { StoreModules, StoreTypes } from '../stores';
import { ExtApiModules, ExtApiTypes } from '../extapis';
import { UtilModules, UtilTypes } from '../utils';
import { InvalidParamError } from '../errors';

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

      const messages = await requestMessages(param.room_token);

      await insertNewReport({
        room_no: room.room_no,
        reporter_no: param.reporter_no,
        target_no: param.target_no,
        content: JSON.stringify(messages)
      });
    });