import { injectable } from 'smart-factory';
import { set } from 'lodash';
import { StoreModules } from './modules';
import { StoreTypes } from './types';
import { MysqlModules, MysqlTypes } from '../mysql';
import { BaseLogicError } from '../errors';

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


class InsufficientNumGachaError extends BaseLogicError {
  constructor(msg: string) {
    super('INSUFFICIENT_NUM_GACHA', msg);
  }
}

injectable(StoreModules.Gacha.GachaNick,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Gacha.GachaNick> =>

  async (memberNo) => {
    return await mysql.transaction(async (con) => {
      const deductionSql = `
        UPDATE
          chatpot_member
        SET
          remain_nick_gacha = remain_nick_gacha - 1
        WHERE
          remain_nick_gacha > 0 AND
          no=?
      `;
      const deductionResp = await con.query(deductionSql, [ memberNo ]) as any;
      if (deductionResp.changedRows !== 1) {
        throw new InsufficientNumGachaError(`remain_nick_gacha was less than 1`);
      }

      const prevNick = await fetchCurrentNick(con, memberNo);
      const newNick = await pickRandomNick(con);

      const deletePrevSql = `
        DELETE FROM
          chatpot_member_has_nick
        WHERE
          member_no=?
      `;
      await con.query(deletePrevSql, [ memberNo ]);

      const insertSql = `
        INSERT INTO
          chatpot_member_has_nick
        SET
          member_no=?,
          language=?,
          nick=?
      `;
      const params = Object.keys(newNick).map((lang) =>
        [ memberNo, lang,
            lang === 'ko' ? newNick.ko :
            lang === 'en' ? newNick.en :
            lang === 'ja' ? newNick.ja : null
        ]);

      const promises = params.map((p) => con.query(insertSql, p));
      await Promise.all(promises);

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