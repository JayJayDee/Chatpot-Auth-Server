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

        } catch (err) {
          log.error(err);
          con.rollback();
          throw err;
        }
      });
    });