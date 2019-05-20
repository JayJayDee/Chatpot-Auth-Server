import { injectable } from 'smart-factory';
import { createHash } from 'crypto';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';


const generateCode = (memberNo: number, email: string) =>
  createHash('sha1')
    .update(`${memberNo}${email}${Date.now()}`)
    .digest('hex');


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
          const code = generateCode(param.member_no, param.email);
          const params = [
            param.member_no,
            param.email,
            code
          ];
          await con.query(sql, params);

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