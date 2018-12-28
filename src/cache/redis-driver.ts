import { createClient, RedisClient } from 'redis';
import { Cache } from './types';
import { RedisConfig } from '../config/types';
import { RedisConnectionError } from './errors';

export const initRedisDriver = (cfg: RedisConfig) =>
  async () => {
    const client = createClient(cfg);
    await inspectConnection(client);
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
  async (): Promise<Cache.Get> => {
    return (key: string): Promise<any> =>
      new Promise((resolve, reject) => {

      });
  };

export const redisSet =
  async (): Promise<Cache.Set> => {
    return (key: string, value: any, expires?: number) =>
      new Promise((resolve, reject) => {

      });
  };