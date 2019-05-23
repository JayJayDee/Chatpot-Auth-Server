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
      let whereClause = '';
      let queryParam: any[] = [];

      if (param.activation_code) {
        whereClause = 'code=?';
        queryParam = [ param.activation_code ];
      } else if (param.member_no) {
        whereClause = 'member_no=?';
        queryParam = [ param.member_no ];
      }

      const sql = `
        SELECT
          email,
          state
        FROM
          chatpot_email
        WHERE
          ${whereClause}
      `;
      const rows = await mysql.query(sql, queryParam) as any[];
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
      const queryParams = [];
      const clauses = [];

      if (param.activation_code) {
        queryParams.push(param.activation_code);
        clauses.push('code=?');
      }
      if (param.member_no) {
        queryParams.push(param.member_no);
        clauses.push('member_no=?');
      }

      const sql =
      `
        UPDATE
          chatpot_email
        SET
          state='CONFIRMED'
        WHERE
          state='SENT' AND
          ${clauses.join(' AND ')}
      `;
      const resp = await mysql.query(sql, queryParams);
      console.log(resp);
      return 0;
    });