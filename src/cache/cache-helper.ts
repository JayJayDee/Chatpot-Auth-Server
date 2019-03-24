import { injectable } from 'smart-factory';
import { CacheTypes } from './types';
import { CacheModules } from './modules';
import { ConfigModules, ConfigTypes } from '../config';


type DataFetcher = () => Promise<any>;

injectable(CacheModules.Helper,
  [ ConfigModules.CacheConfig,
    CacheModules.Get,
    CacheModules.Set ],
  async (cfg: ConfigTypes.CacheConfig,
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