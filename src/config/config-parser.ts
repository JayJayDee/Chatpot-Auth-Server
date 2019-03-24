import { set } from 'lodash';
import { ConfigurationError } from './errors';
import { ConfigTypes } from './types';

const configParser = (emptyConfig: ConfigTypes.RootConfig): ConfigTypes.ConfigParser =>
  (src: ConfigTypes.ConfigSource, rules: ConfigTypes.ConfigRule[]) => {
    rules.map((rule: ConfigTypes.ConfigRule) => {
      const value = src[rule.key];
      if (value === undefined && rule.defaultValue === undefined) {
        throw new ConfigurationError(`configuration not supplied: ${rule.key}`);
      }

      if (value === undefined && rule.defaultValue !== undefined) {
        set(emptyConfig, rule.path, rule.defaultValue);
      } else {
        set(emptyConfig, rule.path, value);
      }
    });
    return emptyConfig;
  };
export default configParser;