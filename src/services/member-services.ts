import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick } from '../stores/types';

export const fetch = (logger: Logger) =>
  async (no: number): Promise<MemberService.Member> => {
    return {
      no: 1,
      token: '',
      nick: ''
    };
  };

export const createMember =
  (logger: Logger, pickNickFunc: Nick.PickNick) =>
    () => {
      
    };
