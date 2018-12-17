export type RootConfig = {
  http: HttpConfig;
  mysql: MysqlConfig;
  credential: CredentialConfig;
};
export type HttpConfig = {
  port: number;
};
export type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
};
export type CredentialConfig = {
  secret: string;
};
export enum Env {
  DEV = 'DEV',
  PROD = 'PROD'
}

export type ConfigRule = {
  key: string;
  path: string[];
  defaultValue?: any;
};
export type ConfigSource = {[key: string]: any};
export type ConfigReader = () => Promise<ConfigSource>;
export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;
export type EnvReader = (src: ConfigSource) => Env;