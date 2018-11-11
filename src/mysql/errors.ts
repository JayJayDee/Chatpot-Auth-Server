export class MysqlInitError extends Error {
  constructor(msg: string) {
    super(`fail to initialize MySQL: ${msg}`);
  }
}