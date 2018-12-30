import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member, Auth } from '../stores/types';
import { AuthUtil } from '../utils/types';

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