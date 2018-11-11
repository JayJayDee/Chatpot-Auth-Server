import { 
  NativePool,
  createPoolConnectionDriver,
  MysqlInitError, 
  MysqlQueryError} from '../../src/mysql';
import { createPoolConnectionTester } from '../../src/mysql/node-mysql-driver';

describe('node-mysql-driver tests', () => {
  test('if getConnection returns error, must be throw error', () => {
    const errorWillBeThrow = new Error('test-error');
    const mockPool: NativePool = {
      getConnection: (callback) => callback(errorWillBeThrow, null)
    };
    expect(createPoolConnectionDriver(mockPool)).rejects.toBeInstanceOf(MysqlInitError);
  });

  test('if getConnection() returns Connection, and if error occurs during query(), must be throw error', () => {
    const mockPool: NativePool = {
      getConnection: (callback) => callback(null, {
        query(query, params, callback) {
          callback(new Error('test-query-error'), null);
        },
        release(callback) {}
      })
    }
    createPoolConnectionDriver(mockPool)
    .then((driver) => {
      expect(driver.query('test-query', [])).rejects.toBeInstanceOf(MysqlQueryError);
    });
  });
});

describe('PoolConnectionTester tests', () => {
  test('if nativePool throws error, poolTester must be throw error', () => {
    const mockPool: NativePool = {
      getConnection: (callback) => callback(new Error('test-error'), null)
    };
    const tester = createPoolConnectionTester(mockPool);
    expect(tester()).rejects.toBeInstanceOf(MysqlInitError);
  });

  test('if nativePool returns connection normally, con::release() must be called', () => {
    const mockRelease = jest.fn((callback) => {});
    const mockPool: NativePool = {
      getConnection: (callback) => callback(null, {
        query(query, params, callback) {},
        release: mockRelease
      })
    };
    const tester = createPoolConnectionTester(mockPool);
    tester().then(() => {
      expect(mockRelease).toBeCalledTimes(1);
    });
  });
});