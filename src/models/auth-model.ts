import { MysqlConnection } from ".";
import { AuthModel } from './types';

const instantiate = (mysql: MysqlConnection): AuthModel => ({
  async createNewAuth(auth: any) {
    return null;
  }
});
export default instantiate;