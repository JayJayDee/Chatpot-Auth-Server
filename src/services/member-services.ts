import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member } from '../stores/types';
import { AuthUtil } from '../utils/types';

export const fetchMember = 
  (logger: Logger,
    fetch: Member.GetMember,
    decrypt: AuthUtil.DecryptToken) =>
    async (token: string): Promise<MemberService.Member> => {
      return {
        token: '',
        nick: null
      };
    };

export const createMember =
  (logger: Logger,
    pick: Nick.PickNick,
    create: Member.InsertMember,
    token: AuthUtil.CreateToken) =>
      async (param: MemberService.ReqCreateMember) => {
        const created = await create(param);
        const memberNo: number = created.member_no;
        const nick = await pick();
        const memberToken = await token(memberNo);
        return {
          nick,
          token: memberToken
        };
      };