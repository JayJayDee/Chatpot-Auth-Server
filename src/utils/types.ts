export namespace AuthUtil {
  export type DecryptedPayload = {
    member_no: number;
    timestamp: number;
  };

  export type CreateToken = (memberNo: number) => string;
  export type DecryptToken = (token: string) => DecryptedPayload;
  export type CreatePassphrase = (memberNo: number) => string;
  export type CreatePassHash = (pass: string) => string;
  export type CreateSessionKey = (memberNo: number) => string;
  export type ValidateSessionKey = (sessionKey: string) => boolean;
}