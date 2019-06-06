import { injectable } from 'smart-factory';
import { GeoIpModules } from './modules';

injectable(GeoIpModules.GetRegionCode,
  [],
  async () =>
    () => {
      return '';
    });