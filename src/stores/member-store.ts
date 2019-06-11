import { injectable } from 'smart-factory';
import { MysqlTypes, MysqlModules } from '../mysql';
import { StoreTypes } from './types';
import { StoreModules } from './modules';
import { UtilModules, UtilTypes } from '../utils';
import { BaseLogicError } from '../errors';

injectable(StoreModules.Member.GetMember,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.GetMember> =>
    async (memberNo: number): Promise<StoreTypes.Member.MemberEntity> => {
      const sql = `
      SELECT
        m.*,
        a.login_id,
        a.auth_type,
        a.token
      FROM
        chatpot_member m
      INNER JOIN
        (
          SELECT
            MAX(no) AS max_no
          FROM
            chatpot_auth
          WHERE
            member_no=?
        ) recentauth
      INNER JOIN
        chatpot_auth a ON
          a.no=recentauth.max_no
      WHERE
        m.no=?`;
      const rows: any = await mysql.query(sql, [memberNo, memberNo]);
      if (rows.length === 0) return null;

      const member: StoreTypes.Member.MemberEntity = {
        no: rows[0].no,
        login_id: rows[0].login_id,
        token: rows[0].token,
        region: rows[0].region,
        language: rows[0].language,
        auth_type: rows[0].auth_type,
        gender: rows[0].gender,
        reg_date: new Date(rows[0].reg_date),
        profile_img: rows[0].profile_img,
        profile_thumb: rows[0].profile_thumb
      };
      return member;
    });

injectable(StoreModules.Member.GetMembers,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.GetMembers> =>
    async (memberNos: number[]): Promise<StoreTypes.Member.MemberEntity[]> => {
      if (memberNos.length === 0) return [];
      const inClause = memberNos.map((n) => '?').join(',');
      const sql = `
        SELECT
          m.*,
          a.auth_type,
          a.token,
          a.login_id
        FROM
          chatpot_member m
        INNER JOIN
          (
            SELECT
              member_no,
              MAX(no) AS max_no
            FROM
              chatpot_auth
            GROUP BY
              member_no
          ) recentauth ON
          recentauth.member_no=m.no
        INNER JOIN
          chatpot_auth a ON
            a.no=recentauth.max_no
        WHERE
          m.no IN (${inClause})
      `;
      const rows: any[] = await mysql.query(sql, memberNos) as any[];
      const resp: StoreTypes.Member.MemberEntity[] =
        rows.map((r) => ({
          no: r.no,
          token: r.token,
          login_id: r.login_id,
          auth_type: r.auth_type,
          region: r.region,
          language: r.language,
          gender: r.gender,
          reg_date: r.reg_date,
          profile_img: r.profile_img,
          profile_thumb: r.profile_thumb
        }));
      return resp;
    });

injectable(StoreModules.Member.InsertMember,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.InsertMember> =>
    async (param) => {
      const sql =
      `
        INSERT INTO
          chatpot_member
        SET
          region=?,
          language=?,
          gender=?,
          reg_date=NOW()
      `;
      const resp: any = await mysql.query(sql, [
        param.region,
        param.language,
        param.gender
      ]);
      const member_no: number = resp.insertId;
      return { member_no };
    });

injectable(StoreModules.Member.UpdateAvatar,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Member.UpdateAvatar> =>
    async (memberNo, avatar) => {
      const sql = `
        UPDATE
          chatpot_member
        SET
          profile_img=?,
          profile_thumb=?
        WHERE
          no=?
      `;
      const params = [ avatar.profile_img, avatar.profile_thumb, memberNo ];
      await mysql.query(sql, params);
    });


class ChangePasswordError extends BaseLogicError {
  constructor(code: string, msg: string) {
    super(code, msg);
  }
}

injectable(StoreModules.Member.ChangePassword,
  [ MysqlModules.MysqlDriver,
    UtilModules.Auth.CreatePassHash,
    UtilModules.Auth.CreateEmailPassphrase ],
  async (mysql: MysqlTypes.MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash,
    emailPassphrase: UtilTypes.Auth.CreateEmailPassphrase): Promise<StoreTypes.Member.ChangePassword> =>
      async (param) => {
        await mysql.transaction(async (t) => {
          const updateSql = `
            UPDATE
              chatpot_auth
            SET
              password=?
            WHERE
              member_no=? AND
              password=? AND
              auth_type='EMAIL'
          `;
          const updateResp: any = await t.query(updateSql, [
            passHash(emailPassphrase(param.new_password)),
            param.member_no,
            passHash(emailPassphrase(param.current_password))
          ]);

          if (updateResp.changedRows !== 1) {
            throw new ChangePasswordError('CURRENT_PASSWORD_INVALID', 'invalid current password or member not found');
          }

          const inspectSql = `
            SELECT
              a.auth_type
            FROM
              chatpot_auth a
            INNER JOIN
              (
                SELECT MAX(no) AS max_no
                  FROM chatpot_auth
                    WHERE member_no=?
              ) recents
            ON a.no=recents.max_no
            WHERE
              member_no=?
          `;
          const rows: any[] = await t.query(inspectSql, [
            param.member_no,
            param.member_no
          ]) as any[];

          if (rows.length === 0) throw new ChangePasswordError('MEMBER_NOT_EXIST', 'member not exist');
          if (rows[0].auth_type !== 'EMAIL') throw new ChangePasswordError('SIMPLE_ACCOUNT_PWCHANGE_DENIED', 'simple_account cannot change password');
        });
      });