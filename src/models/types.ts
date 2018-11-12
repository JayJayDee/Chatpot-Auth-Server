
export interface MemberModel {
  insertNewMember(member: CreateMemberReq): Promise<CreateMemberRes>;
  selectMember(memberNo: number): Promise<GetMemberRes | null>;
}
export interface CreateMemberReq {
  token: string;
  region: string;
  language: string;
}
export interface CreateMemberRes {
  member_token: string;
}
export interface GetMemberRes {
  member_token: string;
  region: string;
  language: string;
}

export interface AuthModel {
  insertNewAuth(auth: CreateAuthReq): Promise<CreateAuthRes>;
}
export interface CreateAuthReq {
  
}
export interface CreateAuthRes {
  
}