export namespace AuthUtil {
  export type DecryptedPayload = {
    member_no: number;
    timestamp: number;
  };

  export type CreateToken = (memberNo: number) => string;
  export type DecryptToken = (token: string) => DecryptedPayload;
}