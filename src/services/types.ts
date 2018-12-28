export namespace MemberService {
  export type Member = {
    region: string;
    language: string;
    gender: string;
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
    token: string;
    nick: Nick;
  };

  export type FetchMember = (token: string) => Promise<Member>;
  export type CreateMember = (param: ReqCreateMember) => Promise<ResCreateMember>;
}