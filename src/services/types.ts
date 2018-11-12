export interface MemberService {
  createMember: (member: CreateMemberReq) => Promise<CreateMemberRes>;
}
export interface Member {
  token: string;
  region: string;
  language: string;
  nick: string;
}
export interface CreateMemberReq {

}
export interface CreateMemberRes {

}