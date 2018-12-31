import { get } from 'lodash';
import { AuthUtil } from '../utils/types';
import { BaseAuthError } from '../errors';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Authenticator } from './types';

class NotAuthenticatedError extends BaseAuthError {
  constructor(msg: string) {
    super('UNAUTHORIZED', msg);
  }
}
class SessionExpiredError extends BaseAuthError {
  constructor() {
    super('SESSION_EXPIRED', 'session expired');
  }
}

export const authenticator =
  (validate: AuthUtil.ValidateSessionKey,
    decrypt: AuthUtil.DecryptToken): Authenticator =>
      (tokenPath: string[]) =>
        (req, res, next) => {
          const token = get(req, tokenPath);
          if (!token) return next(new NotAuthenticatedError('token not found'));
          let decrypted: AuthUtil.DecryptedPayload = null;
          try {
            decrypted = decrypt(token);
          } catch (err) {
            return next(err);
          }

          const sessionKey = req.query['session_key'];
          if (!sessionKey) return next(new NotAuthenticatedError('session_key not found'));

          const validated = validate(token, sessionKey);
          if (validated.valid === false) return next(new NotAuthenticatedError('invalid session_key'));
          if (validated.expired === true) return next(new SessionExpiredError());
          if (decrypted.member_no !== validated.member_no) return next(new NotAuthenticatedError('not allowed operation'));
          next();
        };
injectable(Modules.Endpoint.Middleware.Authenticator,
  [Modules.Util.Auth.ValidateSession,
    Modules.Util.Auth.Decrypt],
  async (validate, decrypt) => authenticator(validate, decrypt));