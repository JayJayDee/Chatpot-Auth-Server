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

    async (roomNo) => {
      // TODO: to be implemented
      return [];
    });