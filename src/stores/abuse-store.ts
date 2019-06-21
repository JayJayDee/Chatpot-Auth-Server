import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MysqlModules, MysqlTypes } from '../mysql';
import { StoreTypes } from './types';

injectable(StoreModules.Abuse.InsertNewAbuse,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Abuse.InsertNewAbuse> =>

    async (param) => {
      // TODO: to be implemented.
    });