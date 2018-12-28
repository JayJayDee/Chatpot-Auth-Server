export namespace MemberService {
  export type Member = {
    token: string;
    nick: Nick;
  };
  export type Nick = {
    en: string;
    ja: string;
    ko: string;
  };
  export type ReqCreateMember = {
    region: string;
    language: string;
    gender: string;
  };
  export type ResCreateMember = {

  };

  export type FetchMember = (no: number) => Promise<Member>;
  export type CreateMember = (param: ReqCreateMember) => Promise<Member>;
}