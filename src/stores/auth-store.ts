import { injectable } from 'smart-factory';
import { MysqlDriver } from '../mysql/types';
import { Logger } from '../loggers/types';
import { Auth } from './types';
import { Modules } from '../modules';
import { UtilModules, UtilTypes } from '../utils';

class SqlException extends Error {}

injectable(Modules.Store.Auth.Insert,
  [ Modules.Mysql,
    UtilModules.Auth.CreatePassHash,
    Modules.Logger ],
  async (mysql: MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash,
    log: Logger): Promise<Auth.InsertAuth> =>

    async (param) => {
      const hashedPassword = passHash(param.password);
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
        hashedPassword
      ];
      try {
        await mysql.query(query, params);
      } catch (err) {
        throw new SqlException(err.message);
      }
    });


injectable(Modules.Store.Auth.Authenticate,
  [ Modules.Mysql,
    UtilModules.Auth.CreatePassHash,
    Modules.Logger ],
  async (mysql: MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash,
    log: Logger): Promise<Auth.Authenticate> =>

    async (param) => {
      const hashed = passHash(param.password);
      console.log(hashed);
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
    });


injectable(Modules.Store.Auth.GetPassword,
  [ Modules.Mysql,
    UtilModules.Auth.DecryptPassHash ],
  async (mysql: MysqlDriver,
    decryptPass: UtilTypes.Auth.DecryptPassHash): Promise<Auth.GetPassword> =>

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
