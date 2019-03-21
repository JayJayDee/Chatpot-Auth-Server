import { MysqlDriver } from '../mysql/types';
import { Logger } from '../loggers/types';
import { Auth } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { AuthUtil } from '../utils/types';

export const insertAuth =
  (mysql: MysqlDriver,
    passHash: AuthUtil.CreatePassHash,
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
        passHash(param.password)
      ];
      await mysql.query(query, params);
    };
injectable(Modules.Store.Auth.Insert,
  [Modules.Mysql, Modules.Util.Auth.PassHash, Modules.Logger],
  async (mysql, hash, log) => insertAuth(mysql, hash, log));

export const authenticate =
  (mysql: MysqlDriver,
    passHash: AuthUtil.CreatePassHash,
    log: Logger): Auth.Authenticate =>
    async (param) => {
      const hashed = passHash(param.password);
      let additionalQuery = '';
      if (param.auth_type) additionalQuery = 'AND auth_type=?';

      const params: any[] = [ param.login_id, hashed ];
      if (param.auth_type) params.push(param.auth_type);
      const query = `
        SELECT * FROM chatpot_auth WHERE login_id=? AND password=? ${additionalQuery}
      `;
      const rows: any[] = await mysql.query(query, params) as any[];
      if (rows.length === 0) {
        return {
          success: false,
          auth_type: null,
          member_no: null
        };
      }
      const resp: Auth.ResAuthenticate = {
        member_no: rows[0].member_no,
        auth_type: rows[0].auth_type,
        success: true
      };
      return resp;
    };
injectable(Modules.Store.Auth.Authenticate,
  [Modules.Mysql, Modules.Util.Auth.PassHash,  Modules.Logger],
  async (mysql, passHash, log) => authenticate(mysql, passHash, log));

injectable(Modules.Store.Auth.GetPassword,
  [ Modules.Mysql,
    Modules.Util.Auth.DecryptPassHash ],
  async (mysql: MysqlDriver,
    decryptPass: AuthUtil.DecryptPassHash): Promise<Auth.GetPassword> =>

    async (memberNo: number) => {
      const sql = `
        SELECT
          password
        FROM
          chatpot_auth
        WHERE
          member_no=?
      `;
      const rows: any[] = await mysql.query(sql, [ memberNo ]) as any[];
      if (rows.length === 0) return null;
      return decryptPass(rows[0].password);
    });
