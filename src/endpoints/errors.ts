import { BaseRuntimeError } from '../errors';

export class InvalidParamError extends BaseRuntimeError {
  constructor(paramName: string) {
    super('INVALID_PARAM', `invalid paremter: ${paramName}`);
  }
}