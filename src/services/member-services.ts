import { MemberService } from './types';

export const fetch = () =>
  async (no: number): Promise<MemberService.Member> => {
    return {
      no: 1,
      token: '',
      nick: ''
    };
  };

export default (): MemberService.MemberService => ({
  fetch: fetch()
});