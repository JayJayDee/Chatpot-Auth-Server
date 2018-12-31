import { createPool, Pool, PoolConnection } from 'mysql';
import { MysqlConfig } from '../config/types';
import { MysqlDriver } from './types';
import { Logger } from '../loggers/types';
import { MysqlConnectionError } from './errors';

const initMysql = (cfg: MysqlConfig, log: Logger) =>
  async (): Promise<MysqlDriver> => {
    log.info('[mysql] establishing MySQL connection...');
    const connector = getConnection(cfg, createPool);
    const pool = await connector();
    log.info('[mysql] MySQL connection established');
    const driver = buildMySQLDriver(pool, getConnectionAsync);
    return driver();
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
type GetConnectionFunction = (pool: Pool) => Promise<PoolConnection>;

export const getConnection =
  (cfg: MysqlConfig, poolCreateFunc: PoolCreateFunction) =>
    (): Promise<Pool> => new Promise((resolve, reject) => {
      const pool = poolCreateFunc(cfg);
      pool.query('SELECT 1', (err, data) => {
        if (err) return reject(new MysqlConnectionError(err.message));
        resolve(pool);
      });
    });

export const buildMySQLDriver =
  (pool: Pool, getConFunc: GetConnectionFunction) =>
    (): MysqlDriver => ({
      query(query: string, param?: any[]) {
        return new Promise((resolve, reject) => {
          getConFunc(pool).then((con) => {
            con.query(query, param, (err, results) => {
              if (err) {
                con.release();
                return reject(err);
              }
              con.release();
              resolve(results);
            });
          })
          .catch(reject);
        });
      }
    });

export const getConnectionAsync =
  (pool: Pool): Promise<PoolConnection> =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err);
        return resolve(connection);
      });
    });