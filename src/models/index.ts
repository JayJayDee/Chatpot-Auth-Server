import { resolve, InstanceType } from '../factory';
import { MysqlConnection } from '../mysql';
import memberModel from './member-model';
import authModel from './auth-model';
import nickModel from './nick-model';
import { MemberModel, AuthModel, NickModel } from './types';

export const initMemberModel = async (): Promise<MemberModel> => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await memberModel({ mysql });
};

export const initAuthModel = async (): Promise<AuthModel> => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await authModel({ mysql });
};

export const initNickModel = async (): Promise<NickModel> => {
  const mysql: MysqlConnection = resolve(InstanceType.Mysql);
  return await nickModel({ mysql });
};

export { MysqlConnection } from '../mysql';
export { Logger } from '../logger';
export {
  MemberModel,
  AuthModel
} from './types';