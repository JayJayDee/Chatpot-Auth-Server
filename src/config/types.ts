export type RootConfig = {
  http: HttpConfig;
  mysql: MysqlConfig;
};
export type HttpConfig = {
  port: number;
};
export type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  database: string;
};


export type ConfigRule = {
  key: string;
  path: string[];
  defaultValue?: any;
};
export type ConfigSource = {[key: string]: any};
export type ConfigReader = () => Promise<ConfigSource>;
export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;