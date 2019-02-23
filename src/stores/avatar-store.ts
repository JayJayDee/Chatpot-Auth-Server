import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { MysqlDriver } from '../mysql/types';
import { AvatarCache } from './types';

injectable(Modules.Store.AvatarCache.Get,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver): Promise<AvatarCache.Get> =>
    async (param) => {
      const sql = `
        SELECT
          profile_img,
          profile_thumb
        FROM
          chatpot_avatar_cache
        WHERE
          nick=? AND gender=?
      `;
      const params = [param.nickEn, param.gender];
      const rows: any[] = await mysql.query(sql, params) as any[];
      if (rows.length === 0) return null;
      return {
        profile_img: rows[0].profile_img,
        profile_thumb: rows[0].profile_thumb
      };
    });

injectable(Modules.Store.AvatarCache.Insert,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver): Promise<AvatarCache.Insert> =>
    async (param) => {
      const sql = `
        INSERT INTO
          chatpot_avatar_cache
          (nick, gender, profile_img, profile_thumb, reg_date)
        SELECT
          ?, ?, ?, ?, NOW()
        WHERE
          (SELECT COUNT(no) FROM chatpot_avatar_cache
            WHERE nick=? AND gender=?) = 0
      `;
      const params = [
        param.nickEn, param.gender, param.profileImg,
        param.profileThumb, param.nickEn, param.gender
      ];
      const resp: any = await mysql.query(sql, params);
      console.log(resp);
      return null;
    });