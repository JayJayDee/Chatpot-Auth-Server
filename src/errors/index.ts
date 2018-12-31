export class BaseRuntimeError extends Error {
  private _code: string = null;
  constructor(code: string, msg: string) {
    super(msg);
    this._code = code;
  }
  public get code() { return this._code; }
}
export class BaseAuthError extends Error {
  private _code: string = null;
  constructor(code: string, msg: string) {
    super(msg);
    this._code = code;
  }
  public get code() { return this._code; }
}
export class BaseInitError extends Error {}