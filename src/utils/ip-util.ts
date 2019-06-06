import { injectable } from 'smart-factory';
import { UtilModules } from './modules';
import { UtilTypes } from './types';

injectable(UtilModules.Ip.GetMyIp,
  [],
  async (): Promise<UtilTypes.Ip.GetMyIp> =>
    (req) => {
      if (req.headers['X-Forwarded-For'] && req.headers['X-Forwarded-For'][0]) {
        return req.headers['X-Forwarded-For'][0];
      }
      return req.ip;
    });