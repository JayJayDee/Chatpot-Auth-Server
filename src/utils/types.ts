export namespace UtilTypes {
  export type RoomPayload = {
    room_no: number;
    timestamp: number;
  };
  export type MemberPayload = {
    member_no: number;
    timestamp: number;
  };
  export type DecryptedSessionKey = {
    valid: boolean;
    expired: boolean;
    member_no: number;
  };

  export type ReqRevalidate = {
    token: string;
    oldSessionKey: string;
    inputedRefreshKey: string;
    passwordFromDb: string;
  };
  export type ResRevalidate = {
    newSessionKey: string;
  };

  export namespace Auth {
    export type CreateMemberToken = (memberNo: number) => string;
    export type DecryptMemberToken = (memberToken: string) => MemberPayload;
    export type CreateRoomToken = (roomNo: number) => string;
    export type DecryptRoomToken = (roomToken: string) => RoomPayload;
    export type ValidateSessionKey = (sessionKey: string) => DecryptedSessionKey;
    export type RevalidateSessionKey = (param: ReqRevalidate) => ResRevalidate;
    export type CreateSessionKey = (memberNo: number) => string;
    export type CreatePassHash = (rawPassword: string) => string;
    export type DecryptPassHash = (encrypted: string) => string;
    export type CreatePassphrase = (memberNo: number) => string;
    export type CreateEmailPassphrase = (rawPassword: string) => string;
  }
}