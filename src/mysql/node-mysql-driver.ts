import { NativePool, MysqlPool, NativeConnection, MysqlConnection, QueryResult } from "./types";

export const createPoolDriver = (nativePool: NativePool): MysqlPool => ({
  getConnection() {
    return new Promise((resolve, reject) => {
      nativePool.getConnection((err, con: NativeConnection) => {
        if (err) return reject(err);
        return resolve(createConnectionDriver(con));
      });      
    });
  }  
});

export const createConnectionDriver = (nativeConnection: NativeConnection): MysqlConnection => ({
  query(query: string, params?: any[]): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      nativeConnection.query(query, params, (err: Error, resp: any) => {
        // TODO: to be implemented.
      });
    });
  }
});