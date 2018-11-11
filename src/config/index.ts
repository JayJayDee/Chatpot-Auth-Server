import { RootConfig, ConfigReadRule, ConfigSource } from './types';
import fileConfReader from './file-conf-reader';
import mapConfig from './config-mapper';
import { readFileSync } from 'fs';

const configReadRule: ConfigReadRule[] = [
  {key: 'HTTP_PORT', path: ['http', 'port']},
  {key: 'MYSQL_HOST', path: ['mysql', 'host']},
  {key: 'MYSQL_PORT', path: ['mysql', 'port']},
  {key: 'MYSQL_DATABASE', path: ['mysql', 'database']},
  {key: 'MYSQL_USER', path: ['mysql', 'user']},
  {key: 'MYSQL_PASSWORD', path: ['mysql', 'password']},
  {key: 'MYSQL_CONNECTION_LIMIT', defaultValue: 10, path: ['mysql', 'connectionLimit']},
];

export const read = (): RootConfig => {
  let source: ConfigSource = fileConfReader(process.env, readFileSync);
  if (source === null) source = process.env;
  return mapConfig(source, configReadRule);
};
export default read;

export { 
  RootConfig,
  MysqlConfig,
  HttpConfig 
} from './types';