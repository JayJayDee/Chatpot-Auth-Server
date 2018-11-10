import { createConnection } from 'mysql';
import { MysqlConfig } from '../config';

const init = (mysqlConfig: MysqlConfig) => {
  return new Promise((resolve, reject) => {
    createConnection(mysqlConfig);
  });
};

export default init;