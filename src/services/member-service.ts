import { CreateMemberReq, MemberService } from './types';
import { MemberModel } from '../models';

const instantiate = (memberModel: MemberModel): MemberService => ({
  createMember(member: CreateMemberReq) {
    return null;
  }
});
export default instantiate;