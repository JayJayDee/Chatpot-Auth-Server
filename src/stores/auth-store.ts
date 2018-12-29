import { MysqlDriver } from '../mysql/types';
import { Logger } from '../loggers/types';
import { Auth } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

export const insertAuth =
  (mysql: MysqlDriver,
    log: Logger): Auth.InsertAuth =>
    async (param: Auth.ReqInsertAuth) => {
      const query = `
        INSERT INTO 
          chatpot_auth 
        SET 
          member_no=?,
          auth_type=?,
          login_id=?,
          token=?,
          password=?,
          reg_date=NOW()
      `;
      const params = [
        param.member_no, param.auth_type,
        param.login_id, param.token,
        param.password
      ];
      await mysql.query(query, params);
    };
    
injectable(Modules.Store.Auth.Insert,
  [Modules.Mysql, Modules.Logger],
  async (mysql, log) => insertAuth(mysql, log));
