import { init, injectable, resolve } from 'smart-factory';
import { Modules } from '../../src/modules';
import { Member } from '../../src/stores/types';

describe('getMember() tests', () => {
  const dummyMysql: any = { query: null };

  beforeAll(() => {
    require('../../src/stores/member-store');
    injectable(Modules.Mysql, [], async () => dummyMysql);
    init().then(() => {
      console.log('factory init');
    });
  });

  test('when MysqlDriver throws error, the function must throws error', () => {
    dummyMysql.query = (query: string, params: any[]) => {
      throw new Error('test-mysql-error');
    };

    (async () => {
      const get = await <Member.GetMember>resolve(Modules.Store.Member.Get);
      expect(() => get(1)).rejects.toBeInstanceOf(Error);
    })();
  });
});