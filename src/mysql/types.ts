export type QueryResultRow = any;
export type QueryFunction = (query: string, params: any[]) => Promise<QueryResultRow[]>;
export interface QueryResult {
  numInserted: number;
  insertId: number;
}
export interface MysqlDriver {
  query: QueryFunction;
}