import { injectable } from 'smart-factory';
import { lookup } from 'geoip-lite';
import { GeoIpModules } from './modules';
import { GeoIpTypes } from './types';
import { LoggerModules, LoggerTypes } from '../loggers';

injectable(GeoIpModules.GetRegionCode,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<GeoIpTypes.GetRegionCode> =>
    (ip) => {
      let lookupResult = lookup(ip);
      if (!lookupResult) {
        lookupResult = lookup('182.253.153.57'); // for develop only
      }
      log.debug(`[region-fetcher] gain ip: ${ip}, region: ${lookupResult.country}`);
      return lookupResult.country;
    });