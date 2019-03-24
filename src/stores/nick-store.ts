import { flatten, set, groupBy } from 'lodash';
import { injectable } from 'smart-factory';
import { MysqlTypes, MysqlModules } from '../mysql';
import { StoreTypes } from './types';
import { StoreModules } from './modules';

export const fetch = (cols: any) => ({
  ko: cols.ko,
  en: cols.en,
  ja: cols.ja
});

export const merge = (adj: StoreTypes.Nick.NickEntity, noun: StoreTypes.Nick.NickEntity) => ({
  ko: adj.ko + ' ' + noun.ko,
  en: adj.en + ' ' + noun.en,
  ja: adj.ja + noun.ja
});

injectable(StoreModules.Nick.PickNick,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Nick.PickNick> =>
    async () => {
      const adjQuery =
      `SELECT * FROM chatpot_nick_pool_adj ORDER BY RAND() LIMIT 1`;
      let rows: any[] = await mysql.query(adjQuery) as any[];
      if (rows.length === 0) return null;
      const adj = fetch(rows[0]);

      const nounQuery =
      `SELECT * FROM chatpot_nick_pool_noun ORDER BY RAND() LIMIT 1`;
      rows = await mysql.query(nounQuery) as any[];
      if (rows.length === 0) return null;
      const noun = fetch(rows[0]);

      return merge(adj, noun);
    });


injectable(StoreModules.Nick.InsertNick,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Nick.InsertNick> =>
    async (req: StoreTypes.Nick.ReqInsertNick) => {
      const rowDatas = Object.keys(req.nick).map((k) => ({
        member_no: req.member_no,
        language: k,
        nick: (req.nick as {[key: string]: string})[k]
      }));
      const valuesClauses = rowDatas.map((r) => '(?,?,?)').join(',');
      const params = rowDatas.map((r) => [r.member_no, r.language, r.nick]);
      const query = `
        INSERT INTO chatpot_member_has_nick
          (member_no, language, nick) VALUES ${valuesClauses}`;
      await mysql.query(query, flatten(params));
    });

injectable(StoreModules.Nick.GetNick,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Nick.GetNick> =>
    async (req) => {
      const nick: StoreTypes.Nick.NickEntity = {
        en: null,
        ko: null,
        ja: null
      };
      const query = `SELECT * FROM chatpot_member_has_nick WHERE member_no=?`;
      const params = [req.member_no];
      const rows: any[] = await mysql.query(query, params) as any[];
      rows.map((r) => set(nick, [r.language], r.nick));
      return nick;
    });

injectable(StoreModules.Nick.GetNickMultiple,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Nick.GetNickMultiple> =>
    async (memberNos: number[]) => {
      if (memberNos.length === 0) return [];
      const inClause = memberNos.map((n) => '?').join(',');
      const sql = `
        SELECT
          *
        FROM
          chatpot_member_has_nick
        WHERE
          member_no IN (${inClause})
      `;
      const rows: any[] = await mysql.query(sql, memberNos) as any[];

      const groupped: {[key: string]: any[]} = groupBy(rows, (r) => r.member_no);
      const nicks: StoreTypes.Nick.NickMatchEntity[] =
        Object.keys(groupped).map((memberNo) => {
          const nick: StoreTypes.Nick.NickMatchEntity = {
            member_no: parseInt(memberNo),
            ko: null,
            ja: null,
            en: null
          };
          groupped[memberNo].map((r) => set(nick, [r.language], r.nick));
          return nick;
        });
      return nicks;
    });