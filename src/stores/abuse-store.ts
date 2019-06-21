import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MysqlModules, MysqlTypes } from '../mysql';
import { StoreTypes } from './types';
import { BaseLogicError } from '../errors';


class AlreadyReportedError extends BaseLogicError {
  constructor() {
    super('ALREADY_REPORTED', 'the user already reported');
  }
}

injectable(StoreModules.Abuse.InsertNewReport,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Abuse.InsertNewAbuse> =>

    async (param) => {
      const insertSql = `
        INSERT INTO
          chatpot_abuse_report
        SET
          status='REPORTED',
          room_no=?,
          reporter_no=?,
          target_no=?,
          content=?,
          reg_date=NOW()
      `;
      const params = [
        param.room_no,
        param.reporter_no,
        param.target_no,
        param.content,
      ];

      try {
        await mysql.query(insertSql, params);
      } catch (err) {
        if (err.message.includes('ER_DUP_ENTRY')) {
          throw new AlreadyReportedError();
        }
        throw err;
      }
    });