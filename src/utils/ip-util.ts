import { injectable } from 'smart-factory';
import { address } from 'ip';
import { UtilModules } from './modules';
import { UtilTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';

injectable(UtilModules.Ip.GetMyIp,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<UtilTypes.Ip.GetMyIp> =>
    (req) => {
      if (req.headers['X-Forwarded-For']) {
        console.log(req.headers['X-Forwarded-For']);
        return req.headers['X-Forwarded-For'][0];
      }
      return address();
    });