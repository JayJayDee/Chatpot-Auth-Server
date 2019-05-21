import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MysqlModules, MysqlTypes } from '../mysql';
import { StoreTypes } from './types';


injectable(StoreModules.Activation.GetActivationStatus,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Activation.GetActivationStatus> =>

    async (param) => {

    });


injectable(StoreModules.Activation.Activate,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Activation.Activate> =>

    async (param) => {

    });