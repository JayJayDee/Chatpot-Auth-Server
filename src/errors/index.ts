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


export class BaseLogicError extends Error {
  private _code: string;
  constructor(code: string, payload: any) {
    super(payload);
    this._code = code;
  }
  public get code() { return this._code; }
}

export class InvalidParamError extends BaseLogicError {
  constructor(paramExpr: string) {
    super('INVALID_PARAM', paramExpr);
  }
}

export class BaseSecurityError extends Error {
  constructor(msg: any) {
    super(msg);
  }
}

export class SecurityExpireError extends BaseSecurityError {
  constructor(msg: any) {
    super(msg);
  }
}

type BlockedPayload = {
  cause_code: string;
  blocked_date: string;
};
export class MemberBlockedErrror extends BaseLogicError {
  constructor(payload: BlockedPayload) {
    super('MEMBER_BLOCKED', `${payload.cause_code}::${payload.blocked_date}`);
  }
}