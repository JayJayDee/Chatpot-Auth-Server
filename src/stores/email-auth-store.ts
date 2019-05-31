import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';
import { BaseLogicError } from '../errors';

class DuplicatedEmailError extends BaseLogicError {
  constructor(email: string) {
    super('DUPLICATED_EMAIL', `duplicated email: ${email}`);
  }
}

injectable(StoreModules.Member.CreateEmailAuth,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.CreateEmailAuth> =>

    async (param) => {
      await mysql.transaction(async (con) => {
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
        try {
          await con.query(sql, params);
        } catch (err) {
          if (err.message.includes('ER_DUP_ENTRY')) {
            throw new DuplicatedEmailError(param.email);
          } else {
            throw err;
          }
        }
      });
    });