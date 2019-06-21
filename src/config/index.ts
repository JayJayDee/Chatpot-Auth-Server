import { injectable } from 'smart-factory';
import { ConfigTypes } from './types';
import { ConfigModules } from './modules';

import configParser from './config-parser';
import configReader from './config-reader';

export const emptyConfig: ConfigTypes.RootConfig = {
  http: {
    port: null
  },
  mysql: {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null,
    connectionLimit: null
  },
  credential: {
    sessionExpires: null,
    secret: null,
    authEnabled: null,
    roomSecret: null
  },
  cache: {
    enabled: null,
    provider: null
  },
  extapi: {
    assetHost: null,
    messageHost: null
  },
  storage: {
    temporaryPath: null
  },
  mailer: {
    host: null,
    port: null,
    secure: null,
    auth: {
      user: null,
      pass: null
    }
  }
};

injectable(ConfigModules.EmptyConfig, [], async () => emptyConfig);

injectable(ConfigModules.ConfigReader, [], async () => configReader(process.env));

injectable(ConfigModules.ConfigParser,
  [ConfigModules.EmptyConfig],
  async (empty: ConfigTypes.RootConfig) => configParser(empty));

injectable(ConfigModules.ConfigSource,
  [ConfigModules.ConfigReader],
  async (read: ConfigTypes.ConfigReader) => read());

injectable(ConfigModules.RootConfig,
  [ConfigModules.ConfigParser,
   ConfigModules.ConfigSource,
   ConfigModules.ConfigRules],
  async (parse: ConfigTypes.ConfigParser,
    src: ConfigTypes.ConfigSource,
    rules: ConfigTypes.ConfigRule[]): Promise<ConfigTypes.RootConfig> => parse(src, rules));

injectable(ConfigModules.HttpConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.http);

injectable(ConfigModules.MysqlConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.mysql);

injectable(ConfigModules.CredentialConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.credential);

injectable(ConfigModules.CacheConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.cache);

injectable(ConfigModules.StorageConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.storage);

injectable(ConfigModules.ExtApiConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.extapi);

injectable(ConfigModules.MailerConfig,
  [ ConfigModules.RootConfig ],
  async (root: ConfigTypes.RootConfig) => root.mailer);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });

// configuration rules.
injectable(ConfigModules.ConfigRules, [],
  async (): Promise<ConfigTypes.ConfigRule[]> => ([
    { key: 'HTTP_PORT', path: ['http', 'port'], defaultValue: 8080 },
    { key: 'MYSQL_HOST', path: ['mysql', 'host'] },
    { key: 'MYSQL_PORT', path: ['mysql', 'port'] },
    { key: 'MYSQL_USER', path: ['mysql', 'user'] },
    { key: 'MYSQL_PASSWORD', path: ['mysql', 'password'] },
    { key: 'MYSQL_DATABASE', path: ['mysql', 'database'] },
    { key: 'MYSQL_CONNECTION_LIMIT', path: ['mysql', 'connectionLimit'], defaultValue: 10 },
    { key: 'CREDENTIAL_SECRET', path: ['credential', 'secret'] },
    { key: 'CREDENTIAL_ROOM_SECRET', path: ['credential', 'roomSecret'] },
    { key: 'CREDENTIAL_SESSION_EXPIRES', path: ['credential', 'sessionExpires'], defaultValue: 60 },
    { key: 'CREDENTIAL_AUTH_ENABLED', path: ['credential', 'authEnabled'], defaultValue: false },
    { key: 'CACHE_ENABLED', path: ['cache', 'enabled'], defaultValue: false},
    { key: 'CACHE_PROVIDER', path: ['cache', 'provider'], defaultValue: 'MEMORY'},
    { key: 'CACHE_REDIS_HOST', path: ['cache', 'redis', 'host'], defaultValue: null},
    { key: 'CACHE_REDIS_PORT', path: ['cache', 'redis', 'port'], defaultValue: null},
    { key: 'CACHE_REDIS_PASSWORD', path: ['cache', 'redis', 'password'], defaultValue: null},
    { key: 'EXTAPI_ASSET_HOST', path: ['extapi', 'assetHost'] },
    { key: 'EXTAPI_MESSAGE_HOST', path: ['extapi', 'messageHost'] },
    { key: 'STORAGE_TEMPORARY_PATH', path: ['storage', 'temporaryPath'] },
    { key: 'MAILER_HOST', path: ['mailer', 'host'] },
    { key: 'MAILER_PORT', path: ['mailer', 'port'] },
    { key: 'MAILER_SECURE', path: ['mailer', 'secure'] },
    { key: 'MAILER_AUTH_USER', path: ['mailer', 'auth', 'user'] },
    { key: 'MAILER_AUTH_PASSWORD', path: ['mailer', 'auth', 'pass'] }
  ]));

  export { ConfigModules } from './modules';
  export { ConfigTypes } from './types';