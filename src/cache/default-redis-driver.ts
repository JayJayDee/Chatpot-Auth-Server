import { Cache } from './types';

export const redisInitializer = () => {

};

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