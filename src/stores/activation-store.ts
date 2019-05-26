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
        whereClause = 'e.code=?';
        queryParam = [ param.activation_code ];
      } else if (param.member_no) {
        whereClause = 'e.member_no=?';
        queryParam = [ param.member_no ];
      }

      const sql = `
        SELECT
          e.email,
          e.state,
          IF(a.auth_type = '', 1, 0) AS password_inputed
        FROM
          chatpot_email e
        INNER JOIN
          chatpot_auth a
          ON a.member_no=e.member_no
        WHERE
          ${whereClause}
      `;
      const rows = await mysql.query(sql, queryParam) as any[];
      if (rows.length === 0) {
        return {
          email: null,
          status: 'IDLE',
          password_inputed: false
        };
      }
      return {
        email: rows[0].email,
        status: rows[0].state,
        password_inputed: rows[0].password_inputed === 1 ? true : false
      };
    });


injectable(StoreModules.Activation.Activate,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Activation.Activate> =>

    async (param) => {
      const queryParams: any[] = [];
      const clauses: any[] = [];

      if (param.activation_code) {
        queryParams.push(param.activation_code);
        clauses.push('e.code=?');
      }
      if (param.member_no) {
        queryParams.push(param.member_no);
        clauses.push('e.member_no=?');
      }

      // TODO: db operation with conditions

      return { activated: true, cause: null };
    });