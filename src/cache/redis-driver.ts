import { createClient, RedisClient } from 'redis';
import { Cache } from './types';
import { RedisConfig } from '../config/types';
import { RedisConnectionError } from './errors';
import { Logger } from '../loggers/types';

const initRedisDriver = 
  (cfg: RedisConfig, log: Logger) =>
    async (): Promise<Cache.CacheOperations> => {
      log.info('[cache] establishing redis connection ...');
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

const redisGet = (client: RedisClient): Cache.Get =>
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

const redisSet = (client: RedisClient): Cache.Set =>
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