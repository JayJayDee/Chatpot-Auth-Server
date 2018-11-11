import { resolve, InstanceType } from '../factory';
import { MysqlConnection } from '../mysql';
import memberModel from './member-model';
import authModel from './auth-model';

export const initMemberModel = async () => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await memberModel(mysql);
};

export const initAuthModel = async () => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await authModel(mysql);
};

export { MysqlConnection } from '../mysql';