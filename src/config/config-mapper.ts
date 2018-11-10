import { set } from 'lodash';

import { ConfigSource, RootConfig, ConfigReadRule } from './types';
import { ConfigurationError } from './errors';

export const emptyConfig: RootConfig = {
  http: {
    port: null
  },
  mysql: {
    host: null,
    port: null,
    database: null,
    user: null,
    password: null
  }
};

const mapConfig = (source: ConfigSource, rules: ConfigReadRule[]): RootConfig => {
  const rootConfig: RootConfig = emptyConfig;

  rules.map((rule: ConfigReadRule) => {
    if (!rule.defaultValue && !source[rule.key]) {
      throw new ConfigurationError(`configuration ${rule.key} not supplied`);
    }
    let value: any = source[rule.key];
    if (!value) value = rule.defaultValue;
    set(rootConfig, rule.path, value);
  });
  return rootConfig;
};

export default mapConfig;