export namespace Member {
  export type MemberEntity = {
    no: number;
    region: string;
    language: string;
    gender: string;
    reg_date: Date;
  };
  export type GetMember = (no: number) => Promise<MemberEntity>;
}