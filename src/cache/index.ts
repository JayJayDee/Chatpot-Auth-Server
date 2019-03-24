import { injectable } from 'smart-factory';
import { LoggerTypes, LoggerModules } from '../loggers';
import { CacheTypes } from './types';
import { CacheModules } from './modules';
import { ConfigModules, ConfigTypes } from '../config';

import memoryCacheFactory from './memory-driver';
import redisCacheFactory from './redis-driver';

export const initCache =
  async (cfg: ConfigTypes.CacheConfig, logger: LoggerTypes.Logger): Promise<CacheTypes.CacheOperations> => {
    let cacheOps: CacheTypes.CacheOperations = null;
    const initMemory = memoryCacheFactory();
    const initRedis = redisCacheFactory(cfg.redis, logger);

    if (cfg.provider === ConfigTypes.CacheProvider.MEMORY) {
      cacheOps = await initMemory(logger);
    } else if (cfg.provider === ConfigTypes.CacheProvider.REDIS) {
      cacheOps = await initRedis();
    }
    return cacheOps;
  };

injectable(CacheModules.Operations,
  [ ConfigModules.CacheConfig, LoggerModules.Logger ],
  initCache);

injectable(CacheModules.Get,
  [ CacheModules.Operations ],
  async (ops: CacheTypes.CacheOperations) => ops.get);

injectable(CacheModules.Set,
  [ CacheModules.Operations ],
  async (ops: CacheTypes.CacheOperations) => ops.set);

export { CacheModules } from './modules';
export { CacheTypes } from './types';