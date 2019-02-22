export namespace MemberService {
  export enum AuthType {
    SIMPLE = 'SIMPLE',
    EMAIL = 'EMAIL'
  }
  export type Member = {
    region: string;
    language: string;
    gender: string;
    auth_type: AuthType;
    nick: Nick;
    token?: string;
    member_no?: number;
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
  export type FetchMembers = (memberNos: number[]) => Promise<Member[]>;
  export type FetchMembersWithToken = (tokens: string[]) => Promise<Member[]>;
  export type CreateMember = (param: ReqCreateMember) => Promise<ResCreateMember>;
  export type Authenticate = (param: ReqAuthenticate) => Promise<ResAuthenticate>;
}