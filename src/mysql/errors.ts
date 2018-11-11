export class MysqlInitError extends Error {
  constructor(msg: string) {
    super(`fail to initialize MySQL: ${msg}`);
  }
}

export class MysqlQueryError extends Error {
  constructor(msg: string) {
    super(`MySQL error during query() : ${msg}`);
  }
}