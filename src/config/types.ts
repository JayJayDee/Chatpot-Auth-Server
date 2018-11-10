export interface RootConfig {
  http: HttpConfig;
  mysql: MysqlConfig;
}

export interface HttpConfig {
  port: number;
}

export interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionLimit: number;
}

export interface ConfigReadRule {
  key: string;
  defaultValue?: any | null;
  path: string[];
}
export type ConfigSource = {[key: string]: any};
export type ConfigMapper = (source: ConfigSource) => RootConfig;