import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';
import { BaseLogicError } from '../errors';

class InvalidUpgradeError extends BaseLogicError {
  constructor() {
    super('INVALID_UPGRADE', 'already email user');
  }
}

injectable(StoreModules.Member.CreateEmailAuth,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.CreateEmailAuth> =>

    async (param) => {
      mysql.transaction(async (con) => {
        try {
          const sql = `
            INSERT INTO
              chatpot_email
            SET
              member_no=?,
              email=?,
              state='SENT',
              code=?,
              reg_date=NOW()
          `;
          const params = [
            param.member_no,
            param.email,
            param.code
          ];
          await con.query(sql, params);

          const inspectSql = `
            SELECT
              *
            FROM
              chatpot_auth
            WHERE
              member_no=? AND
              auth_type='EMAIL'
          `;
          const rows: any[] = await con.query(inspectSql, [ param.member_no ]) as any[];
          if (rows.length > 0) {
            throw new InvalidUpgradeError();
          }

        } catch (err) {
          log.error(err);
          con.rollback();
          throw err;
        }
      });
    });


injectable(StoreModules.Member.VerifyEmailAuthCompleted,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<StoreTypes.Member.VerifyEmailAuthCompleted> =>

    async (param) => {
      return null;
    });