import { injectable } from 'smart-factory';
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
    return null;
  });


injectable(StoreModules.Gacha.GachaProfile,
  [ MysqlModules.MysqlDriver ],
  async (mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Gacha.GachaProfile> =>

  async (memberNo) => {
    return null;
  });