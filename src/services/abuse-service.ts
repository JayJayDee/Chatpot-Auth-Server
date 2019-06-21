import { injectable } from 'smart-factory';
import { ServiceModules } from './modules';
import { ServiceTypes } from './types';

injectable(ServiceModules.Abuse.ReportAbuser,
  [],
  async (): Promise<ServiceTypes.ReportAbuser> =>

    async (param) => {

    });