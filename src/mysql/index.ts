import { createPool } from 'mysql';

import { MysqlConfig } from '../config';
import { MysqlConnection } from './types';
import { createPoolConnectionDriver } from './node-mysql-driver';

const init = async (mysqlConfig: MysqlConfig): Promise<MysqlConnection> => {
  const pool = createPool(mysqlConfig);
  return createPoolConnectionDriver(pool);
};
export default init;

export {
  MysqlPool,
  MysqlConnection
} from './types';

export {
  MysqlConfig
} from '../config';