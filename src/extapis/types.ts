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

  export namespace Message {
    type Nick = {
      en: string;
      ko: string;
      ja: string;
    };
    type Avatar = {
      profile_img: string;
      profile_thumb: string;
    };
    type Member = {
      token: string;
      region: string;
      language: string;
      gender: string;
      avatar: Avatar;
      nick: Nick;
    };
    type Reception = {
      type: ReceptionType;
      token: string;
    };
    enum ReceptionType {
      ROOM = 'ROOM'
    }
    enum MessageType {
      NOTIFICATION = 'NOTIFICATION',
      TEXT = 'TEXT',
      IMAGE = 'IMAGE'
    }
    type Message = {
      message_id: string;
      type: MessageType;
      from?: Member;
      to: Reception;
      content: any;
      sent_time: number;
    };
    export type RequestMessages = (roomToken: string) => Promise<Message[]>;
  }
}