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
    const get = <Member.GetMember>resolve(Modules.Store.Member.Get);
    expect(get(1)).rejects.toBeInstanceOf(Error);
  });

  test('when MysqlDriver returns normal rows, the function returns same values', () => {
    dummyMysql.query = async (query: string, params: any[]) => {
      return [{
        no: 1,
        region: 'KR',
        language: 'ko',
        gender: 'M',
        reg_date: 'asdf'
      }];
    };
    const get = <Member.GetMember>resolve(Modules.Store.Member.Get);
    get(1).then((member) => {
      expect(member.no).toBe(1);
      expect(member.region).toEqual('KR');
      expect(member.language).toEqual('ko');
      expect(member.gender).toEqual('M');
    });
  });
});