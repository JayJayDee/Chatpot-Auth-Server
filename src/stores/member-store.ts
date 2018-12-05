import { MysqlDriver } from '../mysql/types';
import { Member } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

export const getMember = (mysql: MysqlDriver): Member.GetMember =>
  async (memberNo: number): Promise<Member.MemberEntity> => {
    const sql = `SELECT * FROM chatpot_member WHERE no=?`;
    const rows: any = await mysql.query(sql, [memberNo]);
    if (rows.length === 0) return null;
    console.log(rows);
    const member: Member.MemberEntity = {
      no: rows[0].member,
      region: rows[0].member,
      language: rows[0].language,
      gender: rows[0].gender,
      reg_date: new Date(rows[0].reg_date)
    };
    return member;
  };

  injectable(Modules.Store.Member.Get,
    [Modules.Mysql],
    async (mysql: MysqlDriver) => getMember(mysql));