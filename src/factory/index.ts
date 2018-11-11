import { RootConfig } from '../config';
import initMysql from '../mysql';
import {
  initMemberModel,
  initAuthModel
} from '../models';


export enum InstanceType {
  Mysql = 'Mysql',
  MemberModel = 'MemberModel',
  AuthModel = 'AuthModel'
}

let instanceMap = new Map<InstanceType, any>();
export function resolve<T>(type: InstanceType): T {
  const inst: T = instanceMap.get(type) as T;
  return inst;
};

type Instantiator = () => Promise<any>;
const createInstantiator = (map: Map<InstanceType, any>) =>
  async (type: InstanceType, instantiate: Instantiator) => {
    const instance = await instantiate();
    map.set(type, instance);
  };

export default async (rootConfig: RootConfig) => {
  const instantiate = createInstantiator(instanceMap);

  await instantiate(InstanceType.Mysql, async () => initMysql(rootConfig.mysql));
  await instantiate(InstanceType.MemberModel, async () => initMemberModel());
  await instantiate(InstanceType.AuthModel, async () => initAuthModel());
};