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
      const sql = `
        SELECT
          email,
          state
        FROM
          chatpot_email
        WHERE
          member_no=?
      `;
      const rows = await mysql.query(sql, [ param.member_no ]) as any[];
      if (rows.length === 0) return null;
      return {
        email: rows[0].email,
        status: rows[0].state
      };
    });


injectable(StoreModules.Activation.Activate,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Activation.Activate> =>

    async (param) => {

    });