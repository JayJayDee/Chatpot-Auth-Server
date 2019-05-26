import { injectable } from 'smart-factory';
import { StoreModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MysqlModules, MysqlTypes } from '../mysql';
import { StoreTypes } from './types';
import { UtilModules, UtilTypes } from '../utils';


injectable(StoreModules.Activation.GetActivationStatus,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver): Promise<StoreTypes.Activation.GetActivationStatus> =>

    async (param) => {
      let whereClause = '';
      let queryParam: any[] = [];

      if (param.activation_code) {
        whereClause = 'e.code=?';
        queryParam = [ param.activation_code ];
      } else if (param.member_no) {
        whereClause = 'e.member_no=?';
        queryParam = [ param.member_no ];
      }

      const sql = `
        SELECT
          e.email,
          e.state,
          IF(a.auth_type = '', 1, 0) AS password_inputed
        FROM
          chatpot_email e
        INNER JOIN
          chatpot_auth a
          ON a.member_no=e.member_no
        WHERE
          ${whereClause}
      `;
      const rows = await mysql.query(sql, queryParam) as any[];
      if (rows.length === 0) {
        return {
          email: null,
          status: 'IDLE',
          password_inputed: false
        };
      }
      return {
        email: rows[0].email,
        status: rows[0].state,
        password_inputed: rows[0].password_inputed === 1 ? true : false
      };
    });


injectable(StoreModules.Activation.Activate,
  [ LoggerModules.Logger,
    MysqlModules.MysqlDriver,
    UtilModules.Auth.CreatePassHash ],
  async (log: LoggerTypes.Logger,
    mysql: MysqlTypes.MysqlDriver,
    passHash: UtilTypes.Auth.CreatePassHash): Promise<StoreTypes.Activation.Activate> =>

    async (param) => {
      const resp = await mysql.transaction(async (t) => {
        const current = await fetchCurrent(t, param);
        if (current.invalid === true) {
          return { activated: false, cause: 'invalid activation code' };
        }

        if (current.simple_signup === true &&
              !param.password) {
          return { activated: false, cause: 'password must be supplied' };
        }

        const where = createWhereClause(param);
        const updateEmailSql = `
          UPDATE
            chatpot_email
          SET
            state='CONFIRMED'
          WHERE
            ${where.whereClause}
        `;
        const updatedEmailResp: any =
          await t.query(updateEmailSql, [ ...where.params ]);
        console.log(updatedEmailResp);

        if (updatedEmailResp.changedRows === 0) {
          await t.rollback();
          return { activated: false, cause: 'invalid activation code' };
        }

        const authUpdateParams: any[] = [];
        let pwChangeClause = '';
        if (current.simple_signup === true) {
          authUpdateParams.push(passHash(param.password));
          pwChangeClause = ',password=?';
        }

        const authUpdateSql = `
          UPDATE
            chatpot_auth
          SET
            auth_type='EMAIL',
            email_status='ACTIVATED',
            ${pwChangeClause}
          WHERE
            member_no=? AND
            email_status='UNREGISTERED'
        `;
        const authUpdatedResp: any =
          await t.query(authUpdateSql, [ ...authUpdateParams, current.member_no ]);
        if (authUpdatedResp.changedRows === 0) {
          await t.rollback();
          return { activated: false, cause: 'failed to activate' };
        }
        return { activated: true, cause: null };
      });
      return resp;
    });

type WhereClause = {
  whereClause: string;
  params: any[]
};
const createWhereClause = (param: CurrentParam): WhereClause => {
  const whereClause = [];
  const params: any[] = [];

  if (param.activation_code) {
    whereClause.push('e.code=?');
    params.push(param.activation_code);
  }

  if (param.member_no) {
    whereClause.push('e.member_no=?');
    params.push(param.member_no);
  }
  return { params, whereClause: whereClause.join(' AND ') };
};

type CurrentParam = { activation_code?: string; member_no?: number; };
type Current = {
  member_no: number;
  invalid: boolean;
  simple_signup: boolean;
  already_activated: boolean;
};
const fetchCurrent =
  async (t: MysqlTypes.MysqlTransaction, param: CurrentParam): Promise<Current> => {
    const where = createWhereClause(param);

    const sql = `
      SELECT
        e.member_no,
        a.email_status,
        e.auth_type,
        e.state
      FROM
        chatpot_email e
      INNER JOIN
        chatpot_auth a ON a.member_no=e.member_no
      WHERE
        ${where.whereClause}
    `;
    const rows: any[] = await t.query(sql, [ ...where.params ]) as any[];
    if (rows.length === 0) {
      return {
        member_no: null,
        invalid: true,
        simple_signup: null,
        already_activated: null
      };
    }

    let member_no = rows[0].member_no;
    const invalid = false;
    let simple_signup = false;
    let already_activated = false;

    if (rows[0].auth_type === 'SIMPLE') simple_signup = true;
    if (rows[0].email_status === 'ACTIVATED' &&
          rows[0].auth_type === 'EMAIL' &&
          rows[0].state === 'CONFIRMED') already_activated = true;

    return {
      member_no,
      invalid,
      simple_signup,
      already_activated
    };
  };