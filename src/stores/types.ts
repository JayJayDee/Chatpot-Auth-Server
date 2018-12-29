
export namespace Member {
  export type MemberEntity = {
    no: number;
    region: string;
    language: string;
    gender: string;
    reg_date: Date;
  };
  export type ReqCreateMember = {
    region: string;
    language: string;
    gender: string;
  };
  export type ResCreateMember = {
    member_no: number;
  };
  export type GetMember = (no: number) => Promise<MemberEntity>;
  export type InsertMember = (create: ReqCreateMember) => Promise<ResCreateMember>;
}

export namespace Auth {
  export enum AuthType {
    SIMPLE = 'SIMPLE', EMAIL = 'EMAIL'
  }
  export type ReqInsertAuth = {
    member_no: number;
    auth_type: AuthType;
    login_id: string;
    token: string;
    password: string;
  };

  export type InsertAuth = (param: ReqInsertAuth) => Promise<void>;
}

export namespace Nick {
  export type NickEntity = {
    ko: string;
    en: string;
    ja: string;
  };
  export type NickBaseEntity = {
    ko: string;
    en: string;
    ja: string;
  };
  export type ReqInsertNick = {
    member_no: number;
    nick: NickEntity;
  };
  export type ReqGetNick = {
    member_no: number;
  };

  export type PickNick = () => Promise<NickEntity>;
  export type InsertNick = (req: ReqInsertNick) => Promise<void>;
  export type GetNick = (req: ReqGetNick) => Promise<NickEntity>;
}