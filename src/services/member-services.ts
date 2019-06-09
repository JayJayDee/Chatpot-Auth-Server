import { find } from 'lodash';
import { createHash } from 'crypto';
import { ServiceTypes } from './types';
import { injectable } from 'smart-factory';
import { BaseLogicError, InvalidParamError } from '../errors';
import { ExtApiTypes, ExtApiModules } from '../extapis';
import { ServiceModules } from './modules';
import { UtilModules, UtilTypes } from '../utils';
import { LoggerModules, LoggerTypes } from '../loggers';
import { StoreModules, StoreTypes } from '../stores';
import { MailerModules, MailerTypes } from '../mailer';

class AuthFailError extends BaseLogicError {}
class AuthDuplicationError extends BaseLogicError {}

const tag = '[member-service]';


injectable(ServiceModules.Member.Authenticate,
  [LoggerModules.Logger,
    StoreModules.Auth.Authenticate,
    UtilModules.Auth.CreateSessionKey],
  async (logger: LoggerTypes.Logger,
    auth: StoreTypes.Auth.Authenticate,
    createSession: UtilTypes.Auth.CreateSessionKey): Promise<ServiceTypes.Authenticate> =>

    async (param) => {
      const result = await auth({
        login_id: param.login_id,
        password: param.password,
        auth_type: param.auth_type
      });
      if (result.success === false) {
        throw new AuthFailError('AUTH_FAILED', `authentication failed for id:${param.login_id}`);
      }
      const sessionKey = createSession(result.member_no);
      return {
        session_key: sessionKey,
        member_token: result.member_token
      };
    });


class MemberNotFoundError extends BaseLogicError {
  constructor(msg: string) {
    super('MEMBER_NOT_FOUND', msg);
  }
}

injectable(ServiceModules.Member.Fetch,
  [ LoggerModules.Logger,
    StoreModules.Member.GetMember,
    StoreModules.Nick.GetNick,
    UtilModules.Auth.DecryptMemberToken,
    UtilModules.Country.GetCountryName ],
  async (logger: LoggerTypes.Logger,
    getMember: StoreTypes.Member.GetMember,
    getNick: StoreTypes.Nick.GetNick,
    decrypt: UtilTypes.Auth.DecryptMemberToken,
    getCountryName: UtilTypes.Country.GetCountryName): Promise<ServiceTypes.FetchMember> =>

    async (token: string) => {
      const decrypted = decrypt(token);
      if (decrypted === null) {
        throw new InvalidParamError('invalid member_token');
      }

      const member = await getMember(decrypted.member_no);
      if (!member) {
        throw new MemberNotFoundError(`member not found for token: ${token}`);
      }

      const nick = await getNick({ member_no: decrypted.member_no });

      return {
        nick,
        token,
        auth_type: member.auth_type,
        login_id: member.login_id,
        region: member.region,
        region_name: getCountryName(member.region),
        language: member.language,
        gender: member.gender,
        avatar: {
          profile_img: member.profile_img,
          profile_thumb: member.profile_thumb
        }
      };
    });


injectable(ServiceModules.Member.FetchMultiple,
  [ LoggerModules.Logger,
    StoreModules.Member.GetMembers,
    StoreModules.Nick.GetNickMultiple,
    UtilModules.Country.GetCountryName ],
  async (logger: LoggerTypes.Logger,
    getMembers: StoreTypes.Member.GetMembers,
    getNicks: StoreTypes.Nick.GetNickMultiple,
    getCountryName: UtilTypes.Country.GetCountryName): Promise<ServiceTypes.FetchMembers> =>

    async (memberNos: number[]) => {
      const members = await getMembers(memberNos);
      const nicks: StoreTypes.Nick.NickMatchEntity[] = await getNicks(memberNos);
      const resp: ServiceTypes.Member[] = members.map((m) => ({
        token: m.token,
        region: m.region,
        login_id: m.login_id,
        region_name: getCountryName(m.region),
        auth_type: m.auth_type,
        language: m.language,
        gender: m.gender,
        nick: {
          en: find(nicks, {member_no: m.no}).en,
          ko: find(nicks, {member_no: m.no}).ko,
          ja: find(nicks, {member_no: m.no}).ja
        },
        member_no: m.no,
        avatar: {
          profile_img: m.profile_img,
          profile_thumb: m.profile_thumb
        }
      }));
      return resp;
    });


injectable(ServiceModules.Member.Create,
  [ LoggerModules.Logger,
    StoreModules.Nick.PickNick,
    StoreModules.Nick.InsertNick,
    StoreModules.Auth.InsertAuth,
    StoreModules.Member.InsertMember,
    StoreModules.Member.UpdateAvatar,
    UtilModules.Auth.CreateMemberToken,
    UtilModules.Auth.CreatePassphrase,
    UtilModules.Auth.CreateEmailPassphrase,
    ExtApiModules.Asset.RequestAvatar,
    StoreModules.Member.CreateEmailAuth,
    MailerModules.SendActivationMail ],
  async (logger: LoggerTypes.Logger,
    pick: StoreTypes.Nick.PickNick,
    insertNick: StoreTypes.Nick.InsertNick,
    insertAuth: StoreTypes.Auth.InsertAuth,
    create: StoreTypes.Member.InsertMember,
    updateAvt: StoreTypes.Member.UpdateAvatar,
    token: UtilTypes.Auth.CreateMemberToken,
    passphrase: UtilTypes.Auth.CreatePassphrase,
    emailPassphrase: UtilTypes.Auth.CreateEmailPassphrase,
    requestAvatar: ExtApiTypes.Asset.RequestAvatar,
    createEmailAuth: StoreTypes.Member.CreateEmailAuth,
    sendActivationMail: MailerTypes.SendActivationMail): Promise<ServiceTypes.CreateMember> =>

    async (param: ServiceTypes.ReqCreateMember) => {
      const created = await create(param);
      const memberNo: number = created.member_no;

      const nick = await pick();
      const memberToken = await token(memberNo);

      let login_id = null;
      let password = null;

      if (param.auth.auth_type === ServiceTypes.AuthType.EMAIL) {
        login_id = param.auth.login_id;
        password = emailPassphrase(param.auth.password);
      } else if (param.auth.auth_type === ServiceTypes.AuthType.SIMPLE) {
        login_id = memberToken;
        password = passphrase(memberNo);
      }

      try {
        await insertAuth({
          login_id,
          password,
          auth_type: param.auth.auth_type,
          member_no: memberNo,
          token: memberToken,
        });
      } catch (err) {
        logger.error(`[member-create-serv] error: ${err.message}`);
        if (err.message.includes('ER_DUP_ENTRY') === true) {
          throw new AuthDuplicationError('DUPLICATED_ENTRY', `login_id: ${login_id} has a duplication`);
        }
      }

      const avatar = await requestAvatar(nick.en, param.gender);
      await updateAvt(memberNo, avatar);

      await insertNick({
        member_no: memberNo,
        nick
      });

      // TODO: update avatar path.

      const ret: ServiceTypes.ResCreateMember = {
        nick,
        token: memberToken,
        avatar
      };

      if (param.auth.auth_type === ServiceTypes.AuthType.SIMPLE) {
        logger.debug(`${tag} simple login process done.`);
        ret.passphrase = password;

      } else if (param.auth.auth_type === ServiceTypes.AuthType.EMAIL) {
        logger.debug(`${tag} email activation process in progress.`);
        const code = generateCode(memberNo, login_id);
        await createEmailAuth({
          code,
          email: login_id,
          member_no: memberNo
        });
        sendActivationMail({ code, email: login_id });
        ret.passphrase = password;
      }
      return ret;
    });

const generateCode = (memberNo: number, email: string) =>
  createHash('sha1')
    .update(`${memberNo}${email}${Date.now()}`)
    .digest('hex');