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
          comment=?,
          reg_date=NOW()
      `;
      const params = [
        param.room_no,
        param.reporter_no,
        param.target_no,
        param.content,
        param.comment ? param.comment : ''
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


injectable(StoreModules.Abuse.GetReportStatuses,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Abuse.GetReportStatuses> =>

    async (param) => {
      const selectSql = `
        SELECT
          status,
          comment,
          content,
          result,
          reg_date
        FROM
          chatpot_abuse_report
        WHERE
          reporter_no=?
      `;
      const rows: any[] = await mysql.query(selectSql, [ param.member_no ]) as any[];
      return rows.map(convertToCurrentStatus);
    });

const convertToCurrentStatus = (row: any) => ({
  status: row.status,
  comment: row.comment,
  content: row.content,
  result: row.result,
  reg_date: row.reg_date
});


injectable(StoreModules.Abuse.IsBlocked,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Abuse.IsBlocked> =>

    async (param) => {
      // TODO: to be implemented
      return false;
    });