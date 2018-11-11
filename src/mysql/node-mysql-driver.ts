import { NativePool, MysqlConnection, QueryResult } from "./types";

export const createPoolConnectionDriver = (nativePool: NativePool): MysqlConnection => ({
  query(query: string, params?: any[]): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      nativePool.getConnection((err, con) => {
        if (err) return reject(err);
        con.query(query, params, (err: Error, resp: any) => {
          if (err) {
            con.release();
            return reject(err);
          }
          return resolve(resp);
        });
      });
    });
  }
});