import { NativePool, MysqlConnection, QueryResult, NativeConnection } from "./types";
import { MysqlInitError } from './errors';

export const createPoolConnectionDriver = async (nativePool: NativePool): Promise<MysqlConnection> => {
  const tester = createPoolConnectionTester(nativePool);
  try {
    await tester();
  } catch (err) {
    throw new MysqlInitError(err.message);
  }
  return {
    query(query: string, params?: any[]): Promise<QueryResult> {
      return new Promise((resolve, reject) => {
        nativePool.getConnection((err, con) => {
          if (err) return reject(err);
          con.query(query, params, (err: Error, resp: any) => {
            if (err) {
              con.release();
              return reject(err);
            }
            con.release();
            return resolve(resp);
          });
        });
      });
    }
  };
};

const createPoolConnectionTester = (nativePool: NativePool) => 
  (): Promise<void> => {
    return new Promise((resolve, reject) => {
      nativePool.getConnection((err: Error, con: NativeConnection) => {
        if (err) return reject(err);
        con.release();
        return resolve();
      });
    });
  }