export namespace ExtApiTypes {
  export enum RequestMethod {
    POST = 'post', GET = 'get'
  }
  export type RequestParam = {
    uri: string,
    method: RequestMethod,
    qs?: {[key: string]: any};
    body?: {[key: string]: any};
    headers?: {[key: string]: any};
  };
  export type Request = (param: RequestParam) => Promise<any>;

  export namespace Asset {
    export type AvatarRes = {
      profile_img: string;
      profile_thumb: string;
    };
    export type RequestAvatar = (nickEn: string, gender: string) => Promise<AvatarRes>;
  }
}