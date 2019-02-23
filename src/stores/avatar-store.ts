import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { MysqlDriver } from '../mysql/types';
import { AvatarCache } from './types';

injectable(Modules.Store.AvatarCache.Get,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver): Promise<AvatarCache.Get> =>

    async (param) => {
      return null;
    });


injectable(Modules.Store.AvatarCache.Insert,
  [ Modules.Mysql ],
  async (mysql: MysqlDriver): Promise<AvatarCache.Insert> =>

    async (param) => {
      return null;
    });