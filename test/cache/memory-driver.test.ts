import { Logger } from '../../src/loggers/types';
import memoryDriverFactory from '../../src/cache/memory-driver';
import { Cache } from '../../src/cache/types';

describe('initMemoryDriver tests', () => {
  test('the function must show logs on startup', () => {
    const dummyLogger: Logger = {
      info: null,
      debug: null,
      error: null
    };
    dummyLogger.info = jest.fn();
    memoryDriverFactory()(dummyLogger)
    .then((ops: Cache.CacheOperations) => {
      expect(dummyLogger.info).toHaveBeenCalledTimes(1);
    });  
  });
});