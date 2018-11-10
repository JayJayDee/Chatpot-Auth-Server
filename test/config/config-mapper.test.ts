import { ConfigReadRule } from '../../src/config/types';
import mapConfig from '../../src/config/config-mapper';
import { ConfigurationError } from '../../src/config/errors';

describe('ConfigMapper tests', () => {
  let rules: ConfigReadRule[] = null;

  beforeEach(() => {
    rules = [
      {key: 'MANDANTORY_KEY', path: ['http', 'port']},
      {key: 'NON_MANDANTORY_KEY', defaultValue: 'test', path: ['mysql', 'host']}
    ];
  });

  test('rule with mandantory & non-have default values must be throw error', () => {
    const source = {};
    expect(() => {
      mapConfig(source, rules);
    }).toThrowError(ConfigurationError);
  });
});