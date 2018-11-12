import { MysqlConnection } from ".";
import { MemberModel } from './types';

const instantiate = (mysql: MysqlConnection): MemberModel => ({
  async insertNewMember(member: any) {
    return null;
  },

  async selectMember(memberNo: number) {
    return null;
  }
});
export default instantiate;