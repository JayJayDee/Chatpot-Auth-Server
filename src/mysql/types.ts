export type QueryResultRow = any;
export type QueryFunction = (query: string, params: any[]) => Promise<QueryResult>;
export interface QueryCuResult {
  numInserted: number;
  insertId: number;
};
export type QueryResult = QueryCuResult | QueryResultRow[];

export type MysqlConnection = {
  query: QueryFunction;
};
export type MysqlPool = {
  getConnection(): Promise<MysqlConnection>;
};

export type NativePool = {
  getConnection(callback: (err: Error, connection: NativeConnection) => void): void;
};
export type NativeConnection = {
  query: (query: string, params?: any[], callback?: (err: Error, resp: any) => void) => void;
  release: (callback?: (err: Error) => void) => void;
};