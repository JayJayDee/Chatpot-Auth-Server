import { injectable } from 'smart-factory';
import * as moment from 'moment';
import { LoggerModules } from './modules';
import { LoggerTypes } from './types';
import { ConfigModules, ConfigTypes } from '../config';

injectable(LoggerModules.Logger,
  [ ConfigModules.Env ],
  async (env: ConfigTypes.Env): Promise<LoggerTypes.Logger> => ({
    info(payload: any) {
      console.log(prefix(), payload);
    },
    debug(payload: any) {
      if (env === ConfigTypes.Env.DEV) console.log(prefix(), payload);
    },
    error(payload: any) {
      console.error(prefix(), payload);
    }
  }));

const prefix = (): string => `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;