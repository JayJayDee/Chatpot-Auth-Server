import { set } from 'lodash';
import { ConfigSource, ConfigParser, ConfigRule, RootConfig } from "./types";
import { ConfigurationError } from './errors';

const configParser = (emptyConfig: RootConfig): ConfigParser =>
  (src: ConfigSource, rules: ConfigRule[]) => {
    rules.map((rule: ConfigRule) => {
      const value = src[rule.key];
      if (value === undefined && rule.defaultValue !== undefined) {
        set(emptyConfig, rule.path, rule.defaultValue);
      } else if (value !== undefined) {
        set(emptyConfig, rule.path, value);
      }
      throw new ConfigurationError(`configuration not supplied: ${rule.key}`);
    });
    return emptyConfig;
  };
export default configParser;