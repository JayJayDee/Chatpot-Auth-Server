import memoryCacheFactory from './memory-driver';
import redisCacheFactory from './redis-driver';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { CacheConfig, CacheProvider } from '../config/types';
import { Cache } from './types';
import { Logger } from '../loggers/types';

export const initCache = 
  async (cfg: CacheConfig, logger: Logger): Promise<Cache.CacheOperations> => {
    let cacheOps: Cache.CacheOperations = null;
    const initMemory = memoryCacheFactory();
    const initRedis = redisCacheFactory(cfg.redis, logger);

    if (cfg.provider === CacheProvider.MEMORY) {
      cacheOps = await initMemory(logger);
    } else if (cfg.provider === CacheProvider.REDIS) {
      cacheOps = await initRedis();
    }
    return cacheOps;
  };

injectable(Modules.Cache.Operations,
  [ Modules.Config.CacheConfig, Modules.Logger ],
  initCache);

injectable(Modules.Cache.Get,
  [ Modules.Cache.Operations ],
  async (ops: Cache.CacheOperations) => ops.get);

injectable(Modules.Cache.Set,
  [ Modules.Cache.Operations ],
  async (ops: Cache.CacheOperations) => ops.set);