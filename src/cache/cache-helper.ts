import { CacheConfig } from '../config/types';
import { CacheTypes } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { CacheModules } from './modules';

type DataFetcher = () => Promise<any>;

injectable(CacheModules.Helper,
  [ Modules.Config.CacheConfig,
    CacheModules.Get,
    CacheModules.Set ],
  async (cfg: CacheConfig,
    get: CacheTypes.Get,
    set: CacheTypes.Set): Promise<CacheTypes.Helper> =>

    async (key: string, fetcher: DataFetcher) => {
      if (cfg.enabled === false) return await fetcher();
      let cached = await get(key);
      if (cached === null) {
        cached = await fetcher();
        await set(key, cached);
      }
      return cached;
    });