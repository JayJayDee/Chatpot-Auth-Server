import { createClient, RedisClient } from 'redis';
import { Cache } from './types';
import { RedisConfig } from '../config/types';
import { RedisConnectionError } from './errors';

export const initRedisDriver = 
  (cfg: RedisConfig): Promise<Cache.CacheOperations> =>
    async () => {
      const client = createClient(cfg);
      await inspectConnection(client);

      return {
        get: redisGet(client),
        set: redisSet(client)
      };
    };

export const inspectConnection = 
  (client: RedisClient): Promise<void> =>
    new Promise((resolve, reject) => {
      client.get('1', (err, reply) => {
        if (err) return reject(new RedisConnectionError(err.message));
        resolve();
      });
    });

export const redisGet = 
  (client: RedisClient): Cache.Get =>
    (key: string) =>
      new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
          if (err) return reject(err);
          try {
            const content = JSON.parse(reply);
            resolve(content);
          } catch (ex) {
            return resolve(reply);
          }
        });
      });

export const redisSet =
  (client: RedisClient): Cache.Set =>
    (key: string, value: any, expires?: number) =>
      new Promise((resolve, reject) => {
        client.set(key, value, (err, reply) => {

        });
      });