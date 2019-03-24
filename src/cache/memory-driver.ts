import { CacheTypes } from './types';
import { LoggerTypes } from '../loggers';

type Storage = {[key: string]: any};
type ExpireSet = {[key: string]: number};

const initMemoryDriver = () =>
  async (log: LoggerTypes.Logger): Promise<CacheTypes.CacheOperations> => {
    const storage: Storage = {};
    const expset: ExpireSet = {};
    log.info('[cache] using in-memory cache..');
    return {
      get: memoryGet(storage, expset),
      set: memorySet(storage, expset)
    };
  };
export default initMemoryDriver;

const memoryGet =
  (storage: Storage, expset: ExpireSet): CacheTypes.Get =>
    async (key: string) => {
      const value = storage.get(key);
      if (!value) return null;
      if (isExpires(expset, key) === true) {
        delete storage[key];
        delete expset[key];
        return null;
      }
      return value;
    };

const isExpires =
  (expset: ExpireSet, key: string): boolean => {
    if (!expset[key]) return false;
    if (Date.now() < expset[key]) return false;
    return true;
  };

const memorySet =
  (storage: Storage, expset: ExpireSet): CacheTypes.Set =>
    async (key: string, value: any, expires?: number) => {
      storage[key] = value;
      delete expset[key];
      if (expires) {
        expset[key] = Date.now() + expires;
      }
    };