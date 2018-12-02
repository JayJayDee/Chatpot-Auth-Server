export namespace MemberService {
  export type Member = {
    no: number;
    token: string;
    nick: string;
  };
  export type FetchMember = (no: number) => Promise<Member>;

  export type MemberService = {
    fetch: FetchMember;
  };
}