import { MysqlDriver } from '../mysql/types';
import { Nick } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

export const fetch = (cols: any) => ({
  ko: cols.ko,
  en: cols.en,
  ja: cols.ja
});

export const merge = (adj: Nick.NickBaseEntity, noun: Nick.NickBaseEntity) => ({
  ko: adj.ko + ' ' + noun.ko,
  en: adj.en + ' ' + noun.en,
  ja: adj.ja + noun.ja
});

export const pickNick = (mysql: MysqlDriver): Nick.PickNick =>
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
  };

export const insertNick = (mysql: MysqlDriver): Nick.InsertNick =>
  async (req: Nick.ReqInsertNick) => {
    const rowDatas = Object.keys(req.nick).map((k) => ({
      member_no: req.member_no,
      language: k,
      nick: (req.nick as {[key: string]: string})[k]
    }));
    const valuesClauses = rowDatas.map((r) =>
      `(${r.member_no},${r.language},${r.nick})`).join(',');
    const query = `
      INSERT INTO chatpot_member_has_nick 
        (member_no, language, nick) VALUES ${valuesClauses}`;
    const resp = await mysql.query(query);
    console.log(resp);
  };

injectable(Modules.Store.Nick.Pick,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver) => pickNick(mysql));

injectable(Modules.Store.Nick.Insert,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver) => insertNick(mysql));