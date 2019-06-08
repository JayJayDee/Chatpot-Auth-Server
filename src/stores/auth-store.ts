import { injectable } from 'smart-factory';
import { UtilModules, UtilTypes } from '../utils';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MysqlModules, MysqlTypes } from '../mysql';
import { StoreModules } from './modules';
import { StoreTypes } from './types';

class SqlException extends Error {}

injectable(StoreModules.Auth.InsertAuth,
  [ MysqlModules.MysqlDriver,
    UtilModules.Auth.CreatePassHash,
    LoggerModules.Logger ],
  async (mysql: MysqlTypes.MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash,
    log: LoggerTypes.Logger): Promise<StoreTypes.Auth.InsertAuth> =>

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


injectable(StoreModules.Auth.Authenticate,
  [ MysqlModules.MysqlDriver,
    UtilModules.Auth.CreatePassHash,
    LoggerModules.Logger ],
  async (mysql: MysqlTypes.MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash,
    log: LoggerTypes.Logger): Promise<StoreTypes.Auth.Authenticate> =>

    async (param) => {
      const hashed = passHash(param.password);
      const params: any[] = [ param.login_id, hashed ];

      let additionalQuery = '';
      if (param.auth_type) {
        additionalQuery = 'AND auth_type=?';
        params.push(param.auth_type);

        if (param.auth_type === StoreTypes.Auth.AuthType.EMAIL) {
          additionalQuery += ' AND email_status=?';
          params.push('ACTIVATED');
        }
      }

      const query = `
        SELECT * FROM chatpot_auth WHERE login_id=? AND password=? ${additionalQuery}
      `;
      const rows: any[] = await mysql.query(query, params) as any[];
      if (rows.length === 0) {
        return {
          success: false,
          member_token: null,
          auth_type: null,
          member_no: null
        };
      }
      const resp: StoreTypes.Auth.ResAuthenticate = {
        member_token: rows[0].token,
        member_no: rows[0].member_no,
        auth_type: rows[0].auth_type,
        success: true
      };
      return resp;
    });


injectable(StoreModules.Auth.GetPassword,
  [ MysqlModules.MysqlDriver,
    UtilModules.Auth.DecryptPassHash ],
  async (mysql: MysqlTypes.MysqlDriver,
    decryptPass: UtilTypes.Auth.DecryptPassHash): Promise<StoreTypes.Auth.GetPassword> =>

    async (memberNo: number) => {
      const sql = `
        SELECT
          a.password
        FROM
          chatpot_auth a
        INNER JOIN
          (
            SELECT MAX(no) AS max_no
              FROM chatpot_auth
              WHERE member_no=?
          ) recents ON a.no=recents.max_no
      `;
      const rows: any[] = await mysql.query(sql, [ memberNo ]) as any[];
      if (rows.length === 0) return null;
      return decryptPass(rows[0].password);
    });
