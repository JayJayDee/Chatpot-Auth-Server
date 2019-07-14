import { injectable } from 'smart-factory';
import { set } from 'lodash';
import { StoreModules } from './modules';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';

injectable(StoreModules.Gacha.GetStatus,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Gacha.GetStatus> =>

  async (memberNo) => {
    const sql = `
      SELECT
        remain_nick_gacha,
        remain_profile_gacha
      FROM
        chatpot_member
      WHERE
        no=?
    `;
    const params = [ memberNo ];
    const rows: any[] = await mysql.query(sql, params) as any[];
    if (rows.length === 0) return null;
    return {
      remain_nick_gacha: rows[0].remain_nick_gacha,
      remain_profile_gacha: rows[0].remain_profile_gacha
    };
  });


injectable(StoreModules.Gacha.GachaNick,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Gacha.GachaNick> =>

  async (memberNo) => {
    return await mysql.transaction(async (con) => {
      const prevNick = await fetchCurrentNick(con, memberNo);
      const newNick = await pickRandomNick(con);

      // TODO: change required

      return {
        previous: prevNick,
        new: newNick
      };
    });
  });


injectable(StoreModules.Gacha.GachaProfile,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Gacha.GachaProfile> =>

  async (memberNo) => {
    return null;
  });


const fetchCurrentNick = async (mysql: MysqlTypes.MysqlTransaction, memberNo: number) => {
  const nick: StoreTypes.Nick.NickEntity = {
    en: null,
    ko: null,
    ja: null
  };
  const query = `SELECT * FROM chatpot_member_has_nick WHERE member_no=?`;
  const params = [ memberNo ];
  const rows: any[] = await mysql.query(query, params) as any[];
  rows.map((r) => set(nick, [r.language], r.nick));
  return nick;
};

const fetch = (cols: any) => ({
  ko: cols.ko,
  en: cols.en,
  ja: cols.ja
});

const merge = (adj: StoreTypes.Nick.NickEntity, noun: StoreTypes.Nick.NickEntity) => ({
  ko: adj.ko + ' ' + noun.ko,
  en: adj.en + ' ' + noun.en,
  ja: adj.ja + noun.ja
});

const pickRandomNick = async (mysql: MysqlTypes.MysqlTransaction) => {
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