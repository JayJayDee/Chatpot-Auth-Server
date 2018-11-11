import { NativePool, MysqlConnection, QueryResult, NativeConnection } from "./types";
import { MysqlInitError, MysqlQueryError } from './errors';

export const createPoolConnectionDriver = async (nativePool: NativePool): Promise<MysqlConnection> => {
  const tester = createPoolConnectionTester(nativePool);
  await tester();
  
  return {
    query(query: string, params?: any[]): Promise<QueryResult> {
      return new Promise((resolve, reject) => {
        nativePool.getConnection((err, con) => {
          if (err) return reject(new MysqlInitError(err.message));
          con.query(query, params, (err: Error, resp: any) => {
            if (err) {
              con.release();
              return reject(new MysqlQueryError(err.message));
            }
            con.release();
            return resolve(resp);
          });
        });
      });
    }
  };
};

export const createPoolConnectionTester = (nativePool: NativePool) => 
  (): Promise<void> => {
    return new Promise((resolve, reject) => {
      nativePool.getConnection((err: Error, con: NativeConnection) => {
        if (err) return reject(new MysqlInitError(err.message));
        con.release();
        return resolve();
      });
    });
  }