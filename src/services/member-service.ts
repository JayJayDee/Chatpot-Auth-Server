import { CreateMemberReq, MemberService } from './types';
import { MemberModel } from '../models';

const instantiate = (memberModel: MemberModel): MemberService => ({
  createMember(Member: CreateMemberReq) {
    return null;
  }
});
export default instantiate;