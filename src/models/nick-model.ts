import { MysqlConnection } from ".";
import { NickModel } from './types';

interface Dependancies {
  mysql: MysqlConnection;
}

const instantiate = (dep: Dependancies): NickModel => ({
  
});
export default instantiate;