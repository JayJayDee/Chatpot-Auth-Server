import { MysqlConfig } from "../config/types";
import { MysqlDriver } from './types';

const initMysql = (cfg: MysqlConfig) =>
  async (): Promise<MysqlDriver> => {
    return null;
  };
export default initMysql;