import { injectable } from 'smart-factory';
import { getName } from 'country-list';
import { UtilModules } from './modules';
import { UtilTypes } from './types';

injectable(UtilModules.Country.GetCountryName,
  [],
  async (): Promise<UtilTypes.Country.GetCountryName> =>
    (region) => getName(region));