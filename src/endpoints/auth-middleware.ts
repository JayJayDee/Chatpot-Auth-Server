import { AuthUtil } from '../utils/types';
import { BaseAuthError } from '../errors';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { Authenticator } from './types';

class NotAuthenticatedError extends BaseAuthError {}
export const authenticator =
  (validate: AuthUtil.ValidateSessionKey): Authenticator =>
    () => 
      (req, res, next) => {
        const sessionKey = req.query['session_key'];
        if (!sessionKey) return next(new NotAuthenticatedError('unauthorized'));

        const validated = validate(sessionKey);
        if (validated === false) return next(new NotAuthenticatedError('unauthorized'));
        next();
      };
injectable(Modules.Endpoint.Middleware.Authenticator,
  [Modules.Util.Auth.ValidateSession],
  async (validate) => authenticator(validate));