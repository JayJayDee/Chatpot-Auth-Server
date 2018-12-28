import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member } from '../stores/types';
import { AuthUtil } from '../utils/types';

export const fetchMember = 
  (logger: Logger,
    fetch: Member.GetMember,
    decrypt: AuthUtil.DecryptToken) =>
    async (token: string): Promise<MemberService.Member> => {
      const decrypted = decrypt(token);
      const member = await fetch(decrypted.member_no);
      console.log(member);
      return {
        token: '',
        nick: {
          en: '',
          ja: '',
          ko: ''
        }
      };
    };

export const createMember =
  (logger: Logger,
    pick: Nick.PickNick,
    insertNick: Nick.InsertNick,
    create: Member.InsertMember,
    token: AuthUtil.CreateToken) =>
      async (param: MemberService.ReqCreateMember) => {
        const created = await create(param);
        const memberNo: number = created.member_no;
        const nick = await pick();
        await insertNick({
          member_no: memberNo,
          nick
        });
        const memberToken = await token(memberNo);
        return {
          nick,
          token: memberToken
        };
      };