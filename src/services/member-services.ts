import { MemberService } from './types';
import { Logger } from '../loggers/types';

export const fetch = (logger: Logger) =>
  async (no: number): Promise<MemberService.Member> => {
    return {
      no: 1,
      token: '',
      nick: ''
    };
  };