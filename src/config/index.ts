import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { RootConfig, ConfigRule, ConfigReader, ConfigParser, ConfigSource, Env } from './types';

import configParser from './config-parser';
import configReader from './config-reader';

export const emptyConfig: RootConfig = {
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
    secret: null
  },
  cache: {
    enabled: null,
    provider: null
  },
  extapi: {
    assetHost: null
  }
};

injectable(Modules.Config.EmptyConfig, [], async () => emptyConfig);

injectable(Modules.Config.ConfigReader, [], async () => configReader(process.env));

injectable(Modules.Config.ConfigParser,
  [Modules.Config.EmptyConfig],
  async (empty: RootConfig) => configParser(empty));

injectable(Modules.Config.ConfigSource,
  [Modules.Config.ConfigReader],
  async (read: ConfigReader) => read());

injectable(Modules.Config.RootConfig,
  [Modules.Config.ConfigParser,
   Modules.Config.ConfigSource,
   Modules.Config.ConfigRules],
  async (parse: ConfigParser,
    src: ConfigSource,
    rules: ConfigRule[]): Promise<RootConfig> => parse(src, rules));

injectable(Modules.Config.HttpConfig,
  [Modules.Config.RootConfig],
  async (root: RootConfig) => root.http);

injectable(Modules.Config.MysqlConfig,
  [Modules.Config.RootConfig],
  async (root: RootConfig) => root.mysql);

injectable(Modules.Config.CredentialConfig,
  [Modules.Config.RootConfig],
  async (root: RootConfig) => root.credential);

injectable(Modules.Config.CacheConfig,
  [Modules.Config.RootConfig],
  async (root: RootConfig) => root.cache);

injectable(Modules.Config.Env,
  [Modules.Config.ConfigSource],
  async (src: ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return Env.DEV;
    return Env.PROD;
  });

// configuration rules.
injectable(Modules.Config.ConfigRules, [],
  async (): Promise<ConfigRule[]> => ([
    { key: 'HTTP_PORT', path: ['http', 'port'], defaultValue: 8080 },
    { key: 'MYSQL_HOST', path: ['mysql', 'host'] },
    { key: 'MYSQL_PORT', path: ['mysql', 'port'] },
    { key: 'MYSQL_USER', path: ['mysql', 'user'] },
    { key: 'MYSQL_PASSWORD', path: ['mysql', 'password'] },
    { key: 'MYSQL_DATABASE', path: ['mysql', 'database'] },
    { key: 'MYSQL_CONNECTION_LIMIT', path: ['mysql', 'connectionLimit'], defaultValue: 10 },
    { key: 'CREDENTIAL_SECRET', path: ['credential', 'secret'] },
    { key: 'CREDENTIAL_SESSION_EXPIRES', path: ['credential', 'sessionExpires'], defaultValue: 60 },
    { key: 'CACHE_ENABLED', path: ['cache', 'enabled'], defaultValue: false},
    { key: 'CACHE_PROVIDER', path: ['cache', 'provider'], defaultValue: 'MEMORY'},
    { key: 'CACHE_REDIS_HOST', path: ['cache', 'redis', 'host'], defaultValue: null},
    { key: 'CACHE_REDIS_PORT', path: ['cache', 'redis', 'port'], defaultValue: null},
    { key: 'CACHE_REDIS_PASSWORD', path: ['cache', 'redis', 'password'], defaultValue: null},
    { key: 'EXTAPI_ASSET_HOST', path: ['extapi', 'assetHost'] },
  ]));