
export namespace Member {
  export type MemberEntity = {
    no: number;
    region: string;
    language: string;
    gender: string;
    reg_date: Date;
  };
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
  export type PickNick = () => Promise<NickEntity>;
}