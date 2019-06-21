export namespace ConfigTypes {
  export type RootConfig = {
    http: HttpConfig;
    mysql: MysqlConfig;
    cache: CacheConfig;
    extapi: ExtApiConfig;
    credential: CredentialConfig;
    storage: StorageConfig;
    mailer: MailerConfig;
  };
  export type HttpConfig = {
    port: number;
  };
  export type MysqlConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  };
  export type CredentialConfig = {
    authEnabled: boolean;
    sessionExpires: number;
    secret: string;
  };
  export type CacheConfig = {
    enabled: boolean;
    provider: CacheProvider;
    redis?: RedisConfig;
  };
  export type RedisConfig = {
    host: string;
    port: number;
    password?: string;
  };
  export type ExtApiConfig = {
    assetHost: string;
    messageHost: string;
  };
  export type StorageConfig = {
    temporaryPath: string;
  };
  export type MailerConfig = {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  };
  export enum CacheProvider {
    MEMORY = 'MEMORY', REDIS = 'REDIS'
  }
  export enum Env {
    DEV = 'DEV',
    PROD = 'PROD'
  }

  export type ConfigRule = {
    key: string;
    path: string[];
    defaultValue?: any;
  };
  export type ConfigSource = {[key: string]: any};
  export type ConfigReader = () => Promise<ConfigSource>;
  export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;
  export type EnvReader = (src: ConfigSource) => Env;
}