import { injectable } from 'smart-factory';
import { ServiceModules } from './modules';
import { ServiceTypes } from './types';
import { StoreModules, StoreTypes } from '../stores';

injectable(ServiceModules.Abuse.ReportAbuser,
  [ StoreModules.Abuse.InsertNewReport ],
  async (insertNewReport: StoreTypes.Abuse.InsertNewAbuse): Promise<ServiceTypes.ReportAbuser> =>

    async (param) => {

    });