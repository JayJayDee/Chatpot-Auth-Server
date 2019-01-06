import { init, resolve, clear, injectable } from 'smart-factory';
import { Modules } from '../../src/modules';
import { Member } from '../../src/stores/types';

describe('getMember() tests', () => {
  const dummyMysql: any = { query: null };

  beforeEach(() => {
    clear();
    require('../../src/stores/member-store');
    injectable(Modules.Mysql, [], async () => dummyMysql);
  });

  test('when MysqlDriver throws error, the function must throws error', () => {
    dummyMysql.query = (query: string, params: any[]) => {
      throw new Error('test-mysql-error');
    };
    init().then(() => {
      setTimeout(() => {
        const getMember = <Member.GetMember>resolve(Modules.Store.Member.Get);
        console.log(getMember);
        expect(getMember(1)).rejects.toBeInstanceOf(Error);
      }, 100);
    });
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
    init().then(() => {
      const getMember = <Member.GetMember>resolve(Modules.Store.Member.Get);
      getMember(1).then((member) => {
        expect(member.no).toBe(1);
        expect(member.region).toEqual('KR');
        expect(member.language).toEqual('ko');
        expect(member.gender).toEqual('M');
      });
    });
  });
});