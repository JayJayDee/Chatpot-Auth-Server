import { NativeRedisCreateClientFunction, Redis, NativeRedis } from './types';

export const createRedisDriver = (createFunc: NativeRedisCreateClientFunction): Promise<Redis> => {
  const redis: NativeRedis = createFunc();
  return new Promise((resolve, reject) => {

  });
};