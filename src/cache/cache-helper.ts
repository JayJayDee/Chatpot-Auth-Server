import { CacheConfig } from '../config/types';
import { Cache } from './types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';

type DataFetcher = () => Promise<any>;

export const doCached =
  (cfg: CacheConfig, 
    get: Cache.Get,
    set: Cache.Set): Cache.Helper =>
    async (key: string, fetcher: DataFetcher) => {
      if (cfg.enabled === false) {
        return await fetcher();
      }
      let cached = await get(key);
      if (cached === null) {
        cached = await fetcher();
        await set(key, cached);
      }
      return cached;
    };

injectable(Modules.Cache.Helper,
  [Modules.Config.CacheConfig,
    Modules.Cache.Get,
    Modules.Cache.Set],
  async (cfg, get, set) => doCached(cfg, get, set));