import { MysqlDriver } from '../mysql/types';
import { Member } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

type ReqCreateMember = {
  region: string;
  language: string;
  gender: string;
};
type ResCreateMember = {
  member_no: number;
};

type GetMember = (no: number) => Promise<Member.MemberEntity>;
export type InsertMember = (param: ReqCreateMember) => Promise<ResCreateMember>;

export const getMember = (mysql: MysqlDriver): GetMember =>
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

export const insertMember = (mysql: MysqlDriver): InsertMember =>
  async (param: ReqCreateMember) => {
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
    console.log(resp);
    return null;
  };

injectable(Modules.Store.Member.Get,
  [Modules.Mysql],
  async (mysql: MysqlDriver) => getMember(mysql));

injectable(Modules.Store.Member.Insert,
  [Modules.Mysql],
  async (mysql: MysqlDriver) => insertMember(mysql));