import { MemberModel } from "../models";
import { resolve, InstanceType } from '../factory';
import { AuthModel } from '../models/types';

const initMemberService = async () => {
  const memberModel: MemberModel = resolve(InstanceType.MemberModel);
  const authModel: AuthModel = resolve(InstanceType.AuthModel);
  console.log(memberModel);
  console.log(authModel);

  // TODO: to be implemented.
};
export default initMemberService;