import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member } from '../stores/types';

export const fetch = (logger: Logger) =>
  async (no: number): Promise<MemberService.Member> => {
    return {
      token: '',
      nick: null
    };
  };

export const createMember =
  (logger: Logger,
    pick: Nick.PickNick,
    create: Member.InsertMember) =>
      async (param: MemberService.ReqCreateMember) => {
        const created = await create(param);
        const memberNo: number = created.member_no;
        const nick = await pick();
        return {
          nick,
          token: `tokentest${memberNo}`
        };
      };
