import { MysqlConnection } from ".";
import { MemberModel } from './types';

interface Dependancies {
  mysql: MysqlConnection;
}

const instantiate = (dep: Dependancies): MemberModel => ({
  async insertNewMember(member: any) {
    return null;
  },

  async selectMember(memberNo: number) {
    return null;
  }
});
export default instantiate;