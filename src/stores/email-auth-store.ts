import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';

injectable(StoreModules.Member.CreateEmailAuth,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.CreateEmailAuth> =>

      async (param) => {
      });


injectable(StoreModules.Member.VerifyEmailAuthCompleted,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<StoreTypes.Member.VerifyEmailAuthCompleted> =>

    async (param) => {
      return null;
    });