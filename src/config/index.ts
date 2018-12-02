import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { RootConfig, ConfigRule, ConfigReader, ConfigParser, ConfigSource } from './types';

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
    database: null
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

// configuration rules.
injectable(Modules.Config.ConfigRules, [],
  async (): Promise<ConfigRule[]> => ([
    { key: 'HTTP_PORT', path: ['http', 'port'], defaultValue: 8080 }
  ]));