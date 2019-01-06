export namespace MemberService {
  export type Member = {
    region: string;
    language: string;
    gender: string;
    nick: Nick;
    token: string;
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
    passphrase: string;
    nick: Nick;
  };
  export type ReqAuthenticate = {
    login_id: string;
    password: string;
  };
  export type ResAuthenticate = {
    session_key: string;
  };

  export type FetchMember = (token: string) => Promise<Member>;
  export type FetchMembers = (tokens: string[]) => Promise<Member[]>;
  export type CreateMember = (param: ReqCreateMember) => Promise<ResCreateMember>;
  export type Authenticate = (param: ReqAuthenticate) => Promise<ResAuthenticate>;
}