import { createCipher, createDecipher, createHash } from 'crypto';
import { injectable } from 'smart-factory';
import { AuthUtil } from './types';
import { CredentialConfig } from '../config/types';
import { Logger } from '../loggers/types';
import { Modules } from '../modules';
import { BaseAuthError } from '../errors';

export class InvalidTokenError extends BaseAuthError {}

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

export const decryptToken = 
  (log: Logger, cfg: CredentialConfig): AuthUtil.DecryptToken =>
    (token: string) => {
      const dp = decipher(cfg);
      try { 
        let decrypted: string = dp.update(token, 'hex', 'utf8');
        decrypted += dp.final('utf8');
        const splited: string[] = decrypted.split('|@|');
        if (splited.length != 2) throw new InvalidTokenError(`invalid token: ${token}`);
        return {
          member_no: parseInt(splited[0]),
          timestamp: parseInt(splited[1])
        };
      } catch (err) {
        throw new InvalidTokenError(`invalid token: ${token}`);
      }
    };
    
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
