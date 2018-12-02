export type Row = any;

export interface MysqlDriver {
  query: (sql: string, params?: any[]) => Promise<Row[]>;
}