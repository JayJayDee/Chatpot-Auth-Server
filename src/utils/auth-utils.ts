import { createCipher, createDecipher, createHash } from 'crypto';
import { injectable } from 'smart-factory';
import { AuthUtil } from './types';
import { CredentialConfig } from '../config/types';
import { Logger } from '../loggers/types';
import { Modules } from '../modules';
import { BaseAuthError } from '../errors';

export class InvalidTokenError extends BaseAuthError {
  constructor(msg: string) {
    super('UNAUTHORIZED', msg);
  }
}

export type Decrypted = {
  member_no: number;
  timestamp: number;
};

export const encryptToken = (cfg: CredentialConfig): AuthUtil.CreateToken =>
  (memberNo: number) => {
    const cp = cipher(cfg);
    let encrypted: string = '';
    encrypted += cp.update(`${memberNo}|@|${Date.now()}`, 'utf8', 'hex');
    encrypted += cp.final('hex');
    return encrypted;
  };

export const createPassphrase =
  (cfg: CredentialConfig): AuthUtil.CreatePassphrase =>
    (memberNo: number) => {
      const timestamp = Date.now();
      return createHash('sha256')
        .update(`${timestamp}${memberNo}${cfg.secret}`)
        .digest('hex');
    };

export const createPassHash =
  (cfg: CredentialConfig): AuthUtil.CreatePassHash =>
    (pass: string) => {
      return createHash('sha256')
        .update(`${pass}${cfg.secret}`)
        .digest('hex');
    };

export const createSessionKey =
  (cfg: CredentialConfig): AuthUtil.CreateSessionKey =>
    (memberNo: number) => {
      const cp = cipher(cfg);
      let encrypted: string = '';
      encrypted += cp.update(`${memberNo}|@|${Date.now()}`, 'utf8', 'hex');
      encrypted += cp.final('hex');
      return encrypted;
    };

export const validateSessionKey =
  (cfg: CredentialConfig): AuthUtil.ValidateSessionKey =>
    (token: string, sessionKey: string) => {
      const dp = decipher(cfg);
      const resp: AuthUtil.DecryptedSessionKey = {
        valid: false,
        expired: false,
        member_no: null
      };
      try {
        let decrypted: string = dp.update(sessionKey, 'hex', 'utf8');
        decrypted += dp.final('utf8');
        const splited: string[] = decrypted.split('|@|');
        if (splited.length !== 2) return resp;
        const createdAt = parseInt(splited[1]);
        if (Date.now() > createdAt + cfg.sessionExpires * 1000) {
          resp.valid = true;
          resp.member_no = parseInt(splited[0]);
          resp.expired = true;
          return resp;
        }
        resp.valid = true;
        resp.member_no = parseInt(splited[0]);
        return resp;
      } catch (err) {
        return resp;
      }
    };

export const decryptToken =
  (log: Logger, cfg: CredentialConfig): AuthUtil.DecryptToken =>
    (token: string) => {
      const dp = decipher(cfg);
      try {
        let decrypted: string = dp.update(token, 'hex', 'utf8');
        decrypted += dp.final('utf8');
        const splited: string[] = decrypted.split('|@|');
        if (splited.length !== 2) throw new InvalidTokenError(`invalid token: ${token}`);
        return {
          member_no: parseInt(splited[0]),
          timestamp: parseInt(splited[1])
        };
      } catch (err) {
        throw new InvalidTokenError(`invalid token: ${token}`);
      }
    };

injectable(Modules.Util.Auth.RevalidateSession,
  [Modules.Config.CredentialConfig,
    Modules.Util.Auth.Decrypt,
    Modules.Util.Auth.ValidateSession,
    Modules.Util.Auth.CreateSesssion,
    Modules.Logger],
  async (cfg: CredentialConfig,
    decrypt: AuthUtil.DecryptToken,
    validate: AuthUtil.ValidateSessionKey,
    create: AuthUtil.CreateSessionKey,
    log: Logger): Promise<AuthUtil.RevalidateSessionKey> =>

      (token, oldSessionKey, inputedRefreshKey, passwordFromDb) => {
        const validRefreshKey =
          createHash('sha256')
            .update(`${token}${oldSessionKey}${passwordFromDb}`)
            .digest('hex');
        const decryptedToken = decrypt(token);
        const decryptedSessionKey = validate(token, oldSessionKey);

        log.debug(`[auth-util] generated valid refresh_key = ${validRefreshKey}`);

        if (decryptedToken.member_no !== decryptedSessionKey.member_no) {
          throw new InvalidTokenError('unauthorized operation.');
        }
        if (validRefreshKey !== inputedRefreshKey) throw new InvalidTokenError('invalid refresh-token');
        return create(decryptedToken.member_no);
      });

const cipher = (cfg: CredentialConfig) => createCipher('des-ede3-cbc', cfg.secret);
const decipher = (cfg: CredentialConfig) => createDecipher('des-ede3-cbc', cfg.secret);

injectable(Modules.Util.Auth.Encrypt,
  [Modules.Config.CredentialConfig],
  async (cfg) => encryptToken(cfg));

injectable(Modules.Util.Auth.Decrypt,
  [Modules.Logger, Modules.Config.CredentialConfig],
  async (logger, cfg) => decryptToken(logger, cfg));

injectable(Modules.Util.Auth.Passphrase,
  [Modules.Config.CredentialConfig],
  async (cfg) => createPassphrase(cfg));

injectable(Modules.Util.Auth.PassHash,
  [Modules.Config.CredentialConfig],
  async (cfg) => createPassHash(cfg));

injectable(Modules.Util.Auth.CreateSesssion,
  [Modules.Config.CredentialConfig],
  async (cfg) => createSessionKey(cfg));

injectable(Modules.Util.Auth.ValidateSession,
  [Modules.Config.CredentialConfig],
  async (cfg) => validateSessionKey(cfg));