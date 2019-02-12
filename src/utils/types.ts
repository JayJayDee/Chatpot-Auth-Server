export namespace AuthUtil {
  export type DecryptedPayload = {
    member_no: number;
    timestamp: number;
  };
  export type DecryptedSessionKey = {
    valid: boolean;
    expired: boolean;
    member_no: number;
  };

  export type CreateToken = (memberNo: number) => string;
  export type DecryptToken = (token: string) => DecryptedPayload;
  export type CreatePassphrase = (memberNo: number) => string;
  export type CreatePassHash = (pass: string) => string;
  export type DecryptPassHash = (hashedPass: string) => string;
  export type CreateSessionKey = (memberNo: number) => string;
  export type ValidateSessionKey = (token: string, sessionKey: string) => DecryptedSessionKey;
  export type RevalidateSessionKey =
    (token: string, oldSessionKey: string,
      inputedRefreshKey: string, passwordFromDb: string) => string;
}