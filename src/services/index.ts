import { MemberModel } from "../models";
import { resolve, InstanceType } from '../factory';
import initMember from './member-service';

export const initMemberService = async () => {
  const memberModel: MemberModel = resolve(InstanceType.MemberModel);
  // const authModel: AuthModel = resolve(InstanceType.AuthModel);
  // console.log(authModel);
  return await initMember(memberModel);
};