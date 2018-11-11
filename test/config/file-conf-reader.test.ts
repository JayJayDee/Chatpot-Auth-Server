import fileConfReader, { Reader } from '../../src/config/file-conf-reader';
import { ConfigurationError } from '../../src/config/errors';
import { ConfigSource } from '../../src/config/types';

describe('FileConfReader tests', () => {
  test('if CONFIG_FILE env var was not set, must be returns null', () => {
    const read: Reader = jest.fn((path: string) => {
      return new Buffer('asdf');
    });
    const source = {};
    const readSoruce = fileConfReader(source, read);
    expect(read).not.toHaveBeenCalled();
    expect(readSoruce).toBeNull();
  });

  test('if CONFIG_FILE env was set and reader throws exception, must be throw exception', () => {
    const read: Reader = jest.fn((path: string) => {
      throw new Error('test-error');
    });
    const source = {
      CONFIG_FILE: 'test-path'
    };
    expect(() => {
      fileConfReader(source, read);
    }).toThrowError(ConfigurationError);
  });

  test('if CONFIG_FILE env was set and reader returns invalid json, must be throw exception', () => {
    const read: Reader = jest.fn((path: string) => {
      return new Buffer('invalid-json');
    });
    const source = {
      CONFIG_FILE: 'test-path'
    };
    expect(() => {
      fileConfReader(source, read);
    }).toThrowError(ConfigurationError);
  });

  test('if CONFIG_FILE env was set and reader returns valid json, must returns valid object', () => {
    const read: Reader = jest.fn((path: string) => {
      return new Buffer(JSON.stringify({
        TEST_VALUE: 2
      }));
    });
    const source = {
      CONFIG_FILE: 'test-path'
    };
    const readSource: ConfigSource = fileConfReader(source, read);
    expect(readSource['TEST_VALUE']).toBe(2);
  });
});