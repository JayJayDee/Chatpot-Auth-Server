import { createPool } from 'mysql';

import { MysqlConfig } from '../config';
import { MysqlPool } from './types';
import { createPoolDriver } from './node-mysql-driver';

const init = (mysqlConfig: MysqlConfig): MysqlPool => {
  const pool = createPool(mysqlConfig);
  return createPoolDriver(pool);
};
export default init;

export {
  MysqlPool
} from './types';

export {
  MysqlConfig
} from '../config';