import { injectable } from 'smart-factory';
import { createCipher, createDecipher, createHash } from 'crypto';
import { ConfigModules, ConfigTypes } from '../config';
import { LoggerModules, LoggerTypes } from '../loggers';
import { UtilModules } from './modules';
import { UtilTypes } from './types';
import { BaseLogicError } from '../errors';

class RevalidationError extends BaseLogicError {}

const cipher = (secret: string) =>
  createCipher('des-ede3-cbc', secret);

const decipher = (secret: string) =>
  createDecipher('des-ede3-cbc', secret);

injectable(UtilModules.Auth.CreateMemberToken,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.CreateMemberToken> =>
    (memberNo: number) => {
      const cp = cipher(cfg.secret);
      let encrypted: string = '';
      encrypted += cp.update(`${memberNo}|@|${Date.now()}`, 'utf8', 'hex');
      encrypted += cp.final('hex');
      return encrypted;
    });

injectable(UtilModules.Auth.DecryptMemberToken,
  [ ConfigModules.CredentialConfig,
    LoggerModules.Logger ],
  async (cfg: ConfigTypes.CredentialConfig,
    log: LoggerTypes.Logger): Promise<UtilTypes.Auth.DecryptMemberToken> =>
      (memberToken: string) => {
        const dp = decipher(cfg.secret);
          try {
            let decrypted: string = dp.update(memberToken, 'hex', 'utf8');
            decrypted += dp.final('utf8');
            const splited: string[] = decrypted.split('|@|');
            if (splited.length !== 2) {
              log.error(`[authutil] invalid token, decryption successful, but invalid expression: ${memberToken}`);
              return null;
            }
            return {
              member_no: parseInt(splited[0]),
              timestamp: parseInt(splited[1])
            };
          } catch (err) {
            log.error(`[authutil] invalid token, decryption failure: ${memberToken}`);
            return null;
          }
      });

injectable(UtilModules.Auth.ValidateSessionKey,
  [ LoggerModules.Logger,
    ConfigModules.CredentialConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.ValidateSessionKey> =>

    (sessionKey) => {
      const dp = decipher(cfg.secret);
      const resp: UtilTypes.DecryptedSessionKey = {
        valid: false,
        expired: false,
        member_no: null
      };
      try {
        let decrypted: string = dp.update(sessionKey, 'hex', 'utf8');
        decrypted += dp.final('utf8');
        log.debug(`[auth-util] decrypted-session-key = ${decrypted}`);
        const splited: string[] = decrypted.split('|@|');
        if (splited.length !== 2) return resp;
        const createdAt = parseInt(splited[1]);
        if (Date.now() > createdAt + cfg.sessionExpires * 1000) {
          resp.valid = true;
          resp.expired = true;
          resp.member_no = parseInt(splited[0]);
          return resp;
        }
        resp.valid = true;
        resp.member_no = parseInt(splited[0]);
        return resp;
      } catch (err) {
        return resp;
      }
    });

injectable(UtilModules.Auth.CreateSessionKey,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.CreateSessionKey> =>
    (memberNo) => {
      const cp = cipher(cfg.secret);
      let encrypted: string = '';
      encrypted += cp.update(`${memberNo}|@|${Date.now()}`, 'utf8', 'hex');
      encrypted += cp.final('hex');
      return encrypted;
    });

injectable(UtilModules.Auth.RevalidateSessionKey,
  [ LoggerModules.Logger,
    UtilModules.Auth.DecryptMemberToken,
    UtilModules.Auth.ValidateSessionKey,
    UtilModules.Auth.CreateSessionKey ],
  async (log: LoggerTypes.Logger,
    decryptToken: UtilTypes.Auth.DecryptMemberToken,
    validateSession: UtilTypes.Auth.ValidateSessionKey,
    createSession: UtilTypes.Auth.CreateSessionKey): Promise<UtilTypes.Auth.RevalidateSessionKey> =>

    (param) => {
      const decryptedToken = decryptToken(param.token);
      if (decryptToken == null) throw new RevalidationError('REAUTH_ERROR', 'invalid member_token');

      const decryptedSessionKey = validateSession(param.oldSessionKey);
      if (decryptedSessionKey.valid === false) {
        throw new RevalidationError('REAUTH_ERROR', 'invalid session_key');
      }

      log.debug(`inputed refresh_key = ${param.inputedRefreshKey}`);

      log.debug(`member_no from token: ${decryptedToken.member_no}`);
      log.debug(`member_no from session_key: ${decryptedSessionKey.member_no}`);
      if (decryptedToken.member_no !== decryptedSessionKey.member_no) {
        throw new RevalidationError('REAUTH_ERROR', 'unauthorized operation');
      }

      const validRefreshKeys = param.passwordsFromDb.map((pw) =>
        createHash('sha256')
        .update(`${param.token}${param.oldSessionKey}${pw}`)
        .digest('hex'));

      log.debug('[auth-util] valid refresh_keys');
      console.log(validRefreshKeys);

      let foundSame = false;
      for (let i = 0; i < validRefreshKeys.length; i++ ) {
        if (validRefreshKeys[i] === param.inputedRefreshKey) {
          foundSame = true;
          break;
        }
      }

      if (foundSame === false) {
        throw new RevalidationError('REAUTH_ERROR', 'invalid refresh_key');
      }
      const newSessionKey = createSession(decryptedToken.member_no);
      return { newSessionKey };
    });

injectable(UtilModules.Auth.CreatePassHash,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.CreatePassHash> =>
    (rawPassword) => {
      const cp = cipher(cfg.secret);
      let encrypted: string = '';
      encrypted += cp.update(`${rawPassword}`, 'utf8', 'hex');
      encrypted += cp.final('hex');
      return encrypted;
    });

injectable(UtilModules.Auth.DecryptPassHash,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.DecryptPassHash> =>
    (encryptedPassword) => {
      const dp = decipher(cfg.secret);
      let decrypted: string = dp.update(encryptedPassword, 'hex', 'utf8');
      decrypted += dp.final('utf8');
      return decrypted;
    });

injectable(UtilModules.Auth.CreatePassphrase,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.CreatePassphrase> =>
    (memberNo) => {
      const timestamp = Date.now();
      return createHash('sha256')
        .update(`${timestamp}${memberNo}${cfg.secret}`)
        .digest('hex');
    });

injectable(UtilModules.Auth.CreateEmailPassphrase,
  [ ConfigModules.CredentialConfig ],
  async (cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.CreateEmailPassphrase> =>
    (rawPassword) =>
      createHash('sha256')
        .update(`${rawPassword}${cfg.secret}`)
        .digest('hex'));


injectable(UtilModules.Auth.DecryptRoomToken,
  [ LoggerModules.Logger,
    ConfigModules.CredentialConfig ],
  async (log: LoggerTypes.Logger,
    cfg: ConfigTypes.CredentialConfig): Promise<UtilTypes.Auth.DecryptRoomToken> =>
      (roomToken: string) => {
        const dp = decipher(cfg.roomSecret);
        try {
          let decrypted: string = dp.update(roomToken, 'hex', 'utf8');
          decrypted += dp.final('utf8');
          const splited: string[] = decrypted.split('|@|');
          if (splited.length !== 2) {
            log.error(`[authutil] invalid token, decryption successful, but invalid expression: ${roomToken}`);
            return null;
          }
          return {
            room_no: parseInt(splited[0]),
            timestamp: parseInt(splited[1])
          };
        } catch (err) {
          log.error(`[authutil] invalid token, decryption failure: ${roomToken}`);
          return null;
        }
      });