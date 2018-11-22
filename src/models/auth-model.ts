import { MysqlConnection } from ".";
import { AuthModel } from './types';

interface Dependancies {
  mysql: MysqlConnection;
}

const instantiate = (dep: Dependancies): AuthModel => ({
  async insertNewAuth(auth) {
    const query = 
    `
      INSERT INTO
        chatpot_auth
      SET 
        member_no=?,
        auth_type=?,
        login_id=?,
        token=?,
        password=?,
        reg_date=NOW()
    `;
    const params = [auth.member_no, auth.auth_type,
      auth.login_id, auth.token, auth.password];
    const resp: any = await dep.mysql.query(query, params);
    return {
      auth_no: resp.insertId
    };
  }
});
export default instantiate;