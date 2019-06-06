import { injectable } from 'smart-factory';
import { UtilModules } from './modules';
import { UtilTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';

injectable(UtilModules.Ip.GetMyIp,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<UtilTypes.Ip.GetMyIp> =>
    (req) => {
      const candidates = [
        'x-real-ip',
        'x-forwarded-for'
      ];

      let forwarded: string = null;
      for (let idx in candidates) {
        const key = candidates[idx];
        if (req.get(key)) {
          forwarded = req.get(key);
          break;
        }
      }

      if (forwarded) return forwarded;
      return req.connection.remoteAddress;
    });