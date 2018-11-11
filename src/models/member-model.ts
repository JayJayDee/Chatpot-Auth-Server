import { MysqlConnection } from ".";
import { MemberModel } from './types';

const instantiate = (mysql: MysqlConnection): MemberModel => ({
  async createNewMember(member: any) {
    return null;
  },

  async getMember(memberNo: number) {
    return null;
  }
});
export default instantiate;