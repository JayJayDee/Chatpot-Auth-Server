import { injectable } from 'smart-factory';
import { createCipher, createDecipher } from 'crypto';

import { Modules } from '../modules';
import { CredentialConfig } from '../config/types';
import { Logger } from '../loggers/types';

import { UtilModules } from './modules';
import { UtilTypes } from './types';

const cipher = (secret: string) =>
  createCipher('des-ede3-cbc', secret);

const decipher = (secret: string) =>
  createDecipher('des-ede3-cbc', secret);

injectable(UtilModules.Auth.CreateMemberToken,
  [ Modules.Config.CredentialConfig ],
  async (cfg: CredentialConfig): Promise<UtilTypes.Auth.CreateMemberToken> =>
    (memberNo: number) => {
      const cp = cipher(cfg.secret);
      let encrypted: string = '';
      encrypted += cp.update(`${memberNo}|@|${Date.now()}`, 'utf8', 'hex');
      encrypted += cp.final('hex');
      return encrypted;
    });

injectable(UtilModules.Auth.DecryptMemberToken,
  [ Modules.Config.CredentialConfig,
    Modules.Logger ],
  async (cfg: CredentialConfig,
    log: Logger): Promise<UtilTypes.Auth.DecryptMemberToken> =>
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
  [ Modules.Logger,
    Modules.Config.CredentialConfig ],
  async (log: Logger,
    cfg: CredentialConfig): Promise<UtilTypes.Auth.ValidateSessionKey> =>

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
          return resp;
        }
        resp.valid = true;
        resp.member_no = parseInt(splited[0]);
        return resp;
      } catch (err) {
        return resp;
      }
    });