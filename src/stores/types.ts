export namespace StoreTypes {
  export namespace Member {
    export enum AuthType {
      SIMPLE = 'SIMPLE',
      EMAIL = 'EMAIL'
    }
    export type MemberEntity = {
      no: number;
      login_id: string;
      token: string;
      region: string;
      language: string;
      gender: MemberGender;
      auth_type: AuthType;
      reg_date: Date;
      profile_img: string;
      profile_thumb: string;
      max_roulette: number;
    };
    export enum MemberGender {
      M = 'M', F = 'F', NOT_YET = 'NOT_YET'
    }
    export type ReqCreateMember = {
      region: string;
      language: string;
      gender: MemberGender;
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

    type ChangePasswordReq = {
      member_no: number;
      current_password: string;
      new_password: string;
    };
    export type ChangePassword = (param: ChangePasswordReq) => Promise<void>;
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
      member_token: string;
      auth_type: AuthType;
      activated: boolean;
      success: boolean;
    };

    export type InsertAuth = (param: ReqInsertAuth) => Promise<void>;
    export type Authenticate = (param: ReqAuthenticate) => Promise<ResAuthenticate>;
    export type GetPassword = (memberNo: number) => Promise<string[]>;
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
      password_required: boolean;
    };
    export type GetActivationStatus = (param: ActivationStatusParam) => Promise<ActivationStatus>;

    type ActivateParam = {
      member_no?: number;
      activation_code?: string;
      password?: string;
    };
    type ActivateRes = {
      activated: boolean;
      cause: string;
    };
    export type Activate = (param: ActivateParam) => Promise<ActivateRes>;
  }

  export namespace Abuse {
    type InsertAbuseParam = {
      report_type: ReportType;
      room_no: number;
      reporter_no: number;
      target_no: number;
      content: string;
      comment: string;
    };
    enum ReportStatus {
      REPORTED = 'REPORTED',
      IN_PROGRESS = 'IN_PROGRESS',
      DONE = 'DONE'
    }
    export enum ReportType {
      HATE = 'HATE',
      SEXUAL = 'SEXUAL',
      ETC = 'ETC'
    }
    type CurrentReportStatus = {
      status: ReportStatus;
      report_type: ReportType;
      comment: string;
      content: any;
      result: string | null;
      reg_date: string;
    };
    type GetReportStatusesParam = {
      member_no: number;
    };
    type BlockedStatus = {
      blocked: boolean;
      cause_code: string | null;
      blocked_date: string;
    };

    export type InsertNewAbuse = (param: InsertAbuseParam) => Promise<void>;
    export type GetReportStatuses = (param: GetReportStatusesParam) => Promise<CurrentReportStatus[]>;
    export type IsBlocked = (memberNo: number) => Promise<BlockedStatus>;
  }

  export namespace Gacha {
    type GachaStatus = {
      remain_nick_gacha: number;
      remain_avatar_gacha: number;
    };
    export type GetStatus = (memberNo: number) => Promise<GachaStatus>;

    type GachaNickResponse = {
      previous: Nick.NickEntity;
      new: Nick.NickEntity;
    };
    export type GachaNick = (memberNo: number) => Promise<GachaNickResponse>;

    type Avatar = {
      profile_img: string;
      profile_thumb: string;
    };
    type GachaAvatarResponse = {
      previous: Avatar;
      new: Avatar;
    };
    export type GachaAvatar = (memberNo: number) => Promise<GachaAvatarResponse>;
  }
}