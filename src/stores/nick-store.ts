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

injectable(Modules.Store.Nick.Pick,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver) => pickNick(mysql));