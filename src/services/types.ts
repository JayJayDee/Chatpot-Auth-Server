export namespace ServiceTypes {
  export enum AuthType {
    SIMPLE = 'SIMPLE',
    EMAIL = 'EMAIL'
  }
  export type Member = {
    region: string;
    login_id: string;
    region_name: string;
    language: string;
    gender: MemberGender;
    auth_type: AuthType;
    nick: Nick;
    avatar: Avatar;
    token: string;
    member_no?: number;
    max_roulette: number;
  };
  export enum MemberGender {
    M = 'M', F = 'F', NOT_YET = 'NOT_YET'
  }
  export type Nick = {
    en: string;
    ja: string;
    ko: string;
  };
  export type Avatar = {
    profile_img: string;
    profile_thumb: string;
  };
  export type ReqCreateMember = {
    region: string;
    language: string;
    gender: MemberGender;
    auth: ReqAuthParam;
  };
  export type ReqAuthParam = {
    login_id?: string;
    password?: string;
    auth_type: AuthType;
  };
  export type ResCreateMember = {
    token: string;
    passphrase?: string;
    nick: Nick;
    avatar: Avatar;
  };
  export type ReqAuthenticate = {
    login_id: string;
    password: string;
    auth_type?: AuthType;
  };
  export type ResAuthenticate = {
    session_key: string;
    member_token: string;
    activated: boolean;
  };

  export type FetchMember = (token: string) => Promise<Member>;
  export type FetchMembers = (memberNos: number[]) => Promise<Member[]>;
  export type FetchMembersWithToken = (tokens: string[]) => Promise<Member[]>;
  export type CreateMember = (param: ReqCreateMember) => Promise<ResCreateMember>;
  export type Authenticate = (param: ReqAuthenticate) => Promise<ResAuthenticate>;

  export enum ReportType {
    HATE = 'HATE',
    SEXUAL = 'SEXUAL',
    ETC = 'ETC'
  }
  type ReportAbuserParam = {
    report_type: ReportType;
    reporter_no: number;
    target_no: number;
    room_token: string;
    comment?: string;
  };
  export type ReportAbuser = (param: ReportAbuserParam) => Promise<void>;
}