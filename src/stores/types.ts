export namespace StoreTypes {
  export namespace Member {
    export enum AuthType {
      SIMPLE = 'SIMPLE',
      EMAIL = 'EMAIL'
    }
    export type MemberEntity = {
      no: number;
      token: string;
      region: string;
      language: string;
      gender: string;
      auth_type: AuthType;
      reg_date: Date;
      profile_img: string;
      profile_thumb: string;
    };
    export type ReqCreateMember = {
      region: string;
      language: string;
      gender: string;
    };
    export type ResCreateMember = {
      member_no: number;
    };
    export type ProfileAvatar = {
      profile_img: string;
      profile_thumb: string;
    };
    export type GetMember = (no: number) => Promise<MemberEntity>;
    export type GetMembers = (nos: number[]) => Promise<MemberEntity[]>;
    export type InsertMember = (create: ReqCreateMember) => Promise<ResCreateMember>;
    export type UpdateAvatar = (no: number, avatar: ProfileAvatar) => Promise<void>;
    export type CreateEmailAuth = (param: {
      code: string;
      member_no: number;
      email: string
    }) => Promise<void>;
    export type VerifyEmailAuthCompleted = (param: {
      member_no: number;
    }) => Promise<{
      completed: boolean;
    }>;
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
    export type ReqAuthenticate = {
      login_id: string;
      password: string;
      auth_type?: AuthType;
    };
    export type ResAuthenticate = {
      member_no: number;
      auth_type: AuthType;
      success: boolean;
    };

    export type InsertAuth = (param: ReqInsertAuth) => Promise<void>;
    export type Authenticate = (param: ReqAuthenticate) => Promise<ResAuthenticate>;
    export type GetPassword = (memberNo: number) => Promise<string>;
  }

  export namespace Nick {
    export type NickEntity = {
      ko: string;
      en: string;
      ja: string;
    };
    export type NickMatchEntity = {
      member_no: number;
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
    export type GetNickMultiple = (memberNos: number[]) => Promise<NickMatchEntity[]>;
  }

  export namespace Activation {
    type ActivationStatusParam = {
      member_no?: number;
      activation_code?: string;
    };
    type ActivationStatus = {
      email: string;
      status: 'SENT' | 'CONFIRMED' | 'IDLE';
      password_inputed: boolean;
    };
    export type GetActivationStatus = (param: ActivationStatusParam) => Promise<ActivationStatus>;

    type ActivateParam = {
      member_no?: number;
      activation_code?: string;
    };
    type ActivateRes = {
      activated: boolean;
    };
    export type Activate = (param: ActivateParam) => Promise<ActivateRes>;
  }
}