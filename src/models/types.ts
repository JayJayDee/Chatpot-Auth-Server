
export interface MemberModel {
  createNewMember(member: CreateMemberReq): Promise<CreateMemberRes>;
  getMember(memberNo: number): Promise<GetMemberRes | null>;
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
  createNewAuth(auth: CreateAuthReq): Promise<CreateAuthRes>;
}
export interface CreateAuthReq {
  
}
export interface CreateAuthRes {
  
}