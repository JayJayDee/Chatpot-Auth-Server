export interface Redis {
  set: (key: string, value: any) => Promise<any>;
  get: (key: string) => Promise<any>;
}

export type NativeRedisCreateOptions = {

};
export type NativeRedis = {
  createClient: (opts?: NativeRedisCreateOptions) => NativeRedisClient;
};
export type NativeRedisClient = {
  set: (key: string, value: string) => void;
  get: (key: string, callback: NativeRedisCallback) => void;
};
type NativeRedisCallback = (err: Error, resp: any) => void;
export type NativeRedisCreateClientFunction = () => NativeRedisClient;