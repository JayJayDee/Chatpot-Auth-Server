import { NativePool, createPoolConnectionDriver } from '../../src/mysql/index';
import { MysqlInitError } from '../../src/mysql/errors';

describe('node-mysql-driver tests', () => {
  test('if getConnection returns error, must be throw error', () => {
    const errorWillBeThrow = new Error('test-error');
    const mockPool: NativePool = {
      getConnection: (callback) => callback(errorWillBeThrow, null)
    };
    expect(createPoolConnectionDriver(mockPool)).rejects.toBeInstanceOf(MysqlInitError);
  });
});