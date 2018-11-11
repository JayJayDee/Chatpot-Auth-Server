import { resolve, InstanceType } from '../factory';
import { MysqlConnection } from '../mysql';
import memberModel from './member-model';

export const initMemberModel = async () => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await memberModel(mysql);
};

export { MysqlConnection } from '../mysql';