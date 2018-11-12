import { RootConfig } from '../config';
import { NullInstanceError } from './errors';

import initMysql from '../mysql';
import {
  initMemberModel,
  initAuthModel
} from '../models';
import {
  initMemberService
} from '../services';

export enum InstanceType {
  Mysql = 'Mysql',
  MemberModel = 'MemberModel',
  AuthModel = 'AuthModel',

  MemberService = 'MemberService'
}

let instanceMap = new Map<InstanceType, any>();
export function resolve<T>(type: InstanceType): T {
  const inst: T = instanceMap.get(type) as T;
  return inst;
};

type Instantiator = () => Promise<any>;
export const createInstantiator = (map: Map<InstanceType, any>) =>
  async (type: InstanceType, instantiate: Instantiator) => {
    const instance = await instantiate();
    if (!instance) throw new NullInstanceError(`instance was null for type:${type}`);
    map.set(type, instance);
  };

export default async (rootConfig: RootConfig) => {
  const instantiate = createInstantiator(instanceMap);

  // instantiate app base dependancies
  await instantiate(InstanceType.Mysql, async () => initMysql(rootConfig.mysql));

  // instantiate models.
  await instantiate(InstanceType.MemberModel, async () => initMemberModel());
  await instantiate(InstanceType.AuthModel, async () => initAuthModel());

  // instantiate services.
  await instantiate(InstanceType.MemberService, async() => initMemberService());

  console.log(instanceMap);
};