import { createPool, PoolConnection, Pool } from 'mysql';
import { MysqlConfig } from "../config/types";
import { MysqlDriver } from './types';
import { Logger } from '../loggers/types';
import { MysqlConnectionError } from './errors';

const initMysql = (cfg: MysqlConfig, log: Logger) =>
  async (): Promise<MysqlDriver> => {
    const connector = getConnection(cfg, createPool);
    const connection = await connector();
    console.log(connection);
    return null;
  };
export default initMysql;

type PoolCreateOpts = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
};
type PoolCreateFunction = (opts: PoolCreateOpts) => Pool;

export const getConnection = 
  (cfg: MysqlConfig, poolCreateFunc: PoolCreateFunction) =>
    (): Promise<PoolConnection> => new Promise((resolve, reject) => {
      const pool = poolCreateFunc(cfg);
      pool.query('SELECT 1', (err, data) => {
        if (err) return reject(new MysqlConnectionError(err.message));
      });
    });