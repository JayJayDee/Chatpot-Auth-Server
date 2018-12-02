import { injectable } from "smart-factory";
import { Modules } from '../modules';
import { Logger } from './types';
import { Env } from '../config/types';
import * as moment from 'moment';

injectable(Modules.Logger,
  [Modules.Config.Env],
  async (env: Env): Promise<Logger> => ({
    info(payload: any) {
      console.log(prefix(), payload);
    },
    debug(payload: any) {
      if (env === Env.DEV) console.log(prefix(), payload);
    }
  }));

const prefix = (): string => `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;