import { createPool } from 'mysql';

import { MysqlConfig } from '../config';
import { MysqlConnection } from './types';
import { createPoolConnectionDriver } from './node-mysql-driver';

const init = async (mysqlConfig: MysqlConfig): Promise<MysqlConnection> => {
  const pool = createPool(mysqlConfig);
  return await createPoolConnectionDriver(pool);
};
export default init;

export {
  MysqlPool,
  NativePool,
  MysqlConnection
} from './types';

export { 
  createPoolConnectionDriver
} from './node-mysql-driver';

export {
  MysqlConfig
} from '../config';