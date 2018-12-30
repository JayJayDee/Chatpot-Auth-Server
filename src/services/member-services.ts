import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member, Auth } from '../stores/types';
import { AuthUtil } from '../utils/types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { BaseRuntimeError } from '../errors';

class AuthFailError extends BaseRuntimeError {}
export const authenticateMember = 
  (logger: Logger,
    auth: Auth.Authenticate) =>
    async (login_id: string, password: string) => {
      const result = await auth({ login_id, password });
      if (result.success === false) {
        throw new AuthFailError('AUTH_FAILED', `authentication failed for id:${login_id}`);
      }
      // TODO: create session key
    };
// TODO: injectable.

export const fetchMember = 
  (logger: Logger,
    getMember: Member.GetMember,
    getNick: Nick.GetNick,
    decrypt: AuthUtil.DecryptToken): MemberService.FetchMember =>
    async (token: string) => {
      const decrypted = decrypt(token);
      const member = await getMember(decrypted.member_no);
      const nick = await getNick({ member_no: decrypted.member_no });
      return { 
        nick,
        region: member.region,
        language: member.language,
        gender: member.gender
      };
    };
injectable(Modules.Service.Member.Fetch,
  [Modules.Logger,
    Modules.Store.Member.Get,
    Modules.Store.Nick.Get,
    Modules.Util.Auth.Decrypt],
  async (logger, getMember, getNick, decrypt) => 
    fetchMember(logger, getMember, getNick, decrypt));


export const createMember =
  (logger: Logger,
    pick: Nick.PickNick,
    insertNick: Nick.InsertNick,
    insertAuth: Auth.InsertAuth,
    create: Member.InsertMember,
    token: AuthUtil.CreateToken,
    passphrase: AuthUtil.CreatePassphrase): MemberService.CreateMember =>
      async (param: MemberService.ReqCreateMember) => {
        const created = await create(param);
        const memberNo: number = created.member_no;

        const nick = await pick();
        const memberToken = await token(memberNo);
        const pass = passphrase(memberNo);

        await insertNick({
          member_no: memberNo,
          nick
        });
        await insertAuth({
          auth_type: Auth.AuthType.SIMPLE,
          member_no: memberNo,
          login_id: memberToken,
          token: memberToken,
          password: pass
        });
        return {
          nick,
          token: memberToken,
          passphrase: pass
        };
      };
injectable(Modules.Service.Member.Create,
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Nick.Insert,
    Modules.Store.Auth.Insert,
    Modules.Store.Member.Insert,
    Modules.Util.Auth.Encrypt,
    Modules.Util.Auth.Passphrase ],
  async (logger, pick, insertNick, insertAuth, insert, token, pass) =>
    createMember(logger, pick, insertNick, insertAuth, insert, token, pass));
      