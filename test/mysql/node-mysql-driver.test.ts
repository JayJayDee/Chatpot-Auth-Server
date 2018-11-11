import { 
  NativePool,
  createPoolConnectionDriver,
  MysqlInitError } from '../../src/mysql';

describe('node-mysql-driver tests', () => {
  test('if getConnection returns error, must be throw error', () => {
    const errorWillBeThrow = new Error('test-error');
    const mockPool: NativePool = {
      getConnection: (callback) => callback(errorWillBeThrow, null)
    };
    expect(createPoolConnectionDriver(mockPool)).rejects.toBeInstanceOf(MysqlInitError);
  });

  test('if getConnection() returns Connection, and if error occurs during query(), must be throw error', () => {
    
  });
});