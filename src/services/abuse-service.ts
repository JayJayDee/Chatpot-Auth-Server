import { injectable } from 'smart-factory';
import { ServiceModules } from './modules';
import { ServiceTypes } from './types';
import { StoreModules, StoreTypes } from '../stores';
import { ExtApiModules, ExtApiTypes } from '../extapis';

injectable(ServiceModules.Abuse.ReportAbuser,
  [ StoreModules.Abuse.InsertNewReport,
    ExtApiModules.Message.RequestMessages ],
  async (insertNewReport: StoreTypes.Abuse.InsertNewAbuse,
    RequestMessages: ExtApiTypes.Message.RequestMessages): Promise<ServiceTypes.ReportAbuser> =>

    async (param) => {
    });