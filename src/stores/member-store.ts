import { MysqlDriver } from '../mysql/types';
import { Member } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

export const getMember = (mysql: MysqlDriver): Member.GetMember  =>
  async (memberNo: number): Promise<Member.MemberEntity> => {
    const sql = `SELECT * FROM chatpot_member WHERE no=?`;
    const rows: any = await mysql.query(sql, [memberNo]);
    if (rows.length === 0) return null;

    const member: Member.MemberEntity = {
      no: rows[0].no,
      region: rows[0].region,
      language: rows[0].language,
      gender: rows[0].gender,
      reg_date: new Date(rows[0].reg_date)
    };
    return member;
  };

export const getMembers = (mysql: MysqlDriver): Member.GetMembers =>
  async (memberNos: number[]): Promise<Member.MemberEntity[]> => {
    if (memberNos.length === 0) return [];
    const inClause = memberNos.map((n) => '?').join(',');
    const sql = `
      SELECT
        *
      FROM
        chatpot_member
      WHERE
        no IN (${inClause})
    `;
    const rows: any[] = await mysql.query(sql, memberNos) as any[];
    const resp: Member.MemberEntity[] =
      rows.map((r) => ({
        no: r.no,
        region: r.region,
        language: r.language,
        gender: r.gender,
        reg_date: r.reg_date
      }));
    return resp;
  };

export const insertMember = (mysql: MysqlDriver): Member.InsertMember =>
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

injectable(Modules.Store.Member.Get,
  [Modules.Mysql],
  async (mysql: MysqlDriver) => getMember(mysql));

injectable(Modules.Store.Member.GetMultiple,
  [Modules.Mysql],
  async (mysql) => getMembers(mysql));

injectable(Modules.Store.Member.Insert,
  [Modules.Mysql],
  async (mysql: MysqlDriver) => insertMember(mysql));