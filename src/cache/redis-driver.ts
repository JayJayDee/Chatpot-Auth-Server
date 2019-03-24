import { createClient, RedisClient } from 'redis';
import { CacheTypes } from './types';
import { RedisConnectionError } from './errors';
import { LoggerTypes } from '../loggers-new';
import { ConfigTypes } from '../config';

const initRedisDriver =
  (cfg: ConfigTypes.RedisConfig, log: LoggerTypes.Logger) =>
    async (): Promise<CacheTypes.CacheOperations> => {
      log.info('[cache] establishing redis connection ...');
      if (!cfg.password) delete cfg.password;
      const client: RedisClient = createClient(cfg);
      await inspectConnection(client);
      log.info('[cache] redis connection established');
      return {
        get: redisGet(client),
        set: redisSet(client)
      };
    };
export default initRedisDriver;

const inspectConnection = (client: RedisClient): Promise<void> =>
  new Promise((resolve, reject) => {
    client.get('1', (err: Error, reply: string) => {
      if (err) return reject(new RedisConnectionError(err.message));
      resolve();
    });
  });

const redisGet = (client: RedisClient): CacheTypes.Get =>
  (key: string) =>
    new Promise((resolve, reject) => {
      client.get(key, (err: Error, reply: string) => {
        if (err) return reject(err);
        if (reply === null) return resolve(null);
        try {
          const content = JSON.parse(reply);
          resolve(content);
        } catch (ex) {
          resolve(reply);
        }
      });
    });

const redisSet = (client: RedisClient): CacheTypes.Set =>
  (key: string, value: any, expires?: number) =>
    new Promise((resolve, reject) => {
      client.set(key, value, (err: Error, reply: string) => {
        if (err) return reject(err);
        if (!expires) return resolve();
        client.expire(key, expires, (err, reply) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });