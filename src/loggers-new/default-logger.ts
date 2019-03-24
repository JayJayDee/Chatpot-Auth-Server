import { injectable } from 'smart-factory';
import { LoggerModules } from './modules';
import * as moment from 'moment';

import { Modules } from '../modules';
import { Env } from '../config/types';
import { LoggerTypes } from './types';

injectable(LoggerModules.Logger,
  [ Modules.Config.Env ],
  async (env: Env): Promise<LoggerTypes.Logger> => ({
    info(payload: any) {
      console.log(prefix(), payload);
    },
    debug(payload: any) {
      if (env === Env.DEV) console.log(prefix(), payload);
    },
    error(payload: any) {
      console.error(prefix(), payload);
    }
  }));

const prefix = (): string => `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;