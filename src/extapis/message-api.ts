import { injectable } from 'smart-factory';
import { ExtApiModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { ConfigModules, ConfigTypes } from '../config';
import { ExtApiTypes } from './types';

injectable(ExtApiModules.Message.RequestMessages,
  [ LoggerModules.Logger,
    ExtApiModules.Requestor,
    ConfigModules.ExtApiConfig ],
  async (log: LoggerTypes.Logger,
    request: ExtApiTypes.Request,
    extApiCfg: ConfigTypes.ExtApiConfig): Promise<ExtApiTypes.Message.RequestMessages> =>

    async (roomToken) => {
      const uri = `${extApiCfg.messageHost}/internal/room/${roomToken}/messages`;
      const resp: any = await request({
        uri,
        method: ExtApiTypes.RequestMethod.GET
      });
      return resp.messages.map(convertToMessage);
    });

const convertToMessage = (payload: any) => ({
  message_id: payload.message_id,
  type: payload.type,
  from: payload.from,
  to: payload.to,
  content: payload.content,
  sent_time: payload.sent_time
});