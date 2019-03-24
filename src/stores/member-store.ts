import { Member } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

import { MysqlTypes, MysqlModules } from '../mysql';

export const getMember = (mysql: MysqlTypes.MysqlDriver): Member.GetMember  =>
  async (memberNo: number): Promise<Member.MemberEntity> => {
    const sql = `
      SELECT
        m.*,
        a.auth_type,
        a.token
      FROM
        chatpot_member m
      INNER JOIN
        chatpot_auth a ON a.member_no=m.no
      WHERE
        m.no=?`;
    const rows: any = await mysql.query(sql, [memberNo]);
    if (rows.length === 0) return null;

    const member: Member.MemberEntity = {
      no: rows[0].no,
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
  };

export const getMembers = (mysql: MysqlTypes.MysqlDriver): Member.GetMembers =>
  async (memberNos: number[]): Promise<Member.MemberEntity[]> => {
    if (memberNos.length === 0) return [];
    const inClause = memberNos.map((n) => '?').join(',');
    const sql = `
      SELECT
        m.*,
        a.auth_type,
        a.token
      FROM
        chatpot_member m
      INNER JOIN
        chatpot_auth a ON a.member_no=m.no
      WHERE
        m.no IN (${inClause})
    `;
    const rows: any[] = await mysql.query(sql, memberNos) as any[];
    const resp: Member.MemberEntity[] =
      rows.map((r) => ({
        no: r.no,
        token: r.token,
        auth_type: r.auth_type,
        region: r.region,
        language: r.language,
        gender: r.gender,
        reg_date: r.reg_date,
        profile_img: r.profile_img,
        profile_thumb: r.profile_thumb
      }));
    return resp;
  };

export const insertMember = (mysql: MysqlTypes.MysqlDriver): Member.InsertMember =>
  async (param: Member.ReqCreateMember): Promise<Member.ResCreateMember> => {
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
  };

injectable(Modules.Store.Member.UpdateAvatar,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<Member.UpdateAvatar> =>
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

injectable(Modules.Store.Member.Get,
  [ MysqlModules.MysqlDriver ],
  async (mysql) => getMember(mysql));

injectable(Modules.Store.Member.GetMultiple,
  [ MysqlModules.MysqlDriver ],
  async (mysql) => getMembers(mysql));

injectable(Modules.Store.Member.Insert,
  [ MysqlModules.MysqlDriver ],
  async (mysql) => insertMember(mysql));