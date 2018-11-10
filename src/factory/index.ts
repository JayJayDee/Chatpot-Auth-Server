import initMysql from '../mysql';
import { RootConfig } from '../config';

export enum InstanceType {
  Mysql = 'Mysql'
}

let instanceMap = new Map<InstanceType, any>();
export function resolve<T>(type: InstanceType): T {
  const inst: T = instanceMap.get(type) as T;
  return inst;
};

type Instanciator = () => Promise<any>;
const createInstanciator = (map: Map<InstanceType, any>) =>
  async (type: InstanceType, instanciate: Instanciator) => {
    const instance = await instanciate();
    map.set(type, instance);
  };

export default async (rootConfig: RootConfig) => {
  const instanciate = createInstanciator(instanceMap);
  await instanciate(InstanceType.Mysql, async () => initMysql(rootConfig.mysql));
};