import { RootConfig } from '../config';
import initMysql from '../mysql';
import {
  initMemberModel
} from '../models';


export enum InstanceType {
  Mysql = 'Mysql',
  MemberModel = 'MemberModel'
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
  const instanciate = createInstantiator(instanceMap);

  await instanciate(InstanceType.Mysql, async () => initMysql(rootConfig.mysql));
  await instanciate(InstanceType.MemberModel, async () => initMemberModel());
};