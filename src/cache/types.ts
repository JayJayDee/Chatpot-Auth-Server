export namespace Cache {
  export type Get = (key: string) => Promise<any>;
  export type Set = (key: string, value: any, expires?: number) => Promise<void>;

  export type Helper = (key: string, fetcher: () => Promise<any>) => Promise<any>;

  export type CacheOperations = {
    get: Get;
    set: Set;
  };
}