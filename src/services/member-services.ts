import { find } from 'lodash';
import { ServiceTypes } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member, Auth } from '../stores/types';
import { injectable } from 'smart-factory';
import { BaseLogicError } from '../errors';
import { ExtApiTypes } from '../extapis';
import { ServiceModules } from './modules';
import { Modules } from '../modules';
import { UtilModules, UtilTypes } from '../utils';

class AuthFailError extends BaseLogicError {}
class AuthDuplicationError extends BaseLogicError {}


injectable(ServiceModules.Member.Authenticate,
  [Modules.Logger,
    Modules.Store.Auth.Authenticate,
    UtilModules.Auth.CreateSessionKey],
  async (logger: Logger,
    auth: Auth.Authenticate,
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
        session_key: sessionKey
      };
    });


injectable(ServiceModules.Member.Fetch,
  [ Modules.Logger,
    Modules.Store.Member.Get,
    Modules.Store.Nick.Get,
    UtilModules.Auth.DecryptMemberToken ],
  async (logger: Logger,
    getMember: Member.GetMember,
    getNick: Nick.GetNick,
    decrypt: UtilTypes.Auth.DecryptMemberToken): Promise<ServiceTypes.FetchMember> =>

    async (token: string) => {
      const decrypted = decrypt(token);
      const member = await getMember(decrypted.member_no);
      const nick = await getNick({ member_no: decrypted.member_no });
      return {
        nick,
        token,
        auth_type: member.auth_type,
        region: member.region,
        language: member.language,
        gender: member.gender,
        avatar: {
          profile_img: member.profile_img,
          profile_thumb: member.profile_thumb
        }
      };
    });


injectable(ServiceModules.Member.FetchMultiple,
  [ Modules.Logger,
    Modules.Store.Member.GetMultiple,
    Modules.Store.Nick.GetMultiple ],
  async (logger: Logger,
    getMembers: Member.GetMembers,
    getNicks: Nick.GetNickMultiple): Promise<ServiceTypes.FetchMembers> =>

    async (memberNos: number[]) => {
      const members = await getMembers(memberNos);
      const nicks: Nick.NickMatchEntity[] = await getNicks(memberNos);
      const resp: ServiceTypes.Member[] = members.map((m) => ({
        token: m.token,
        region: m.region,
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
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Nick.Insert,
    Modules.Store.Auth.Insert,
    Modules.Store.Member.Insert,
    Modules.Store.Member.UpdateAvatar,
    UtilModules.Auth.CreateMemberToken,
    UtilModules.Auth.CreatePassphrase,
    Modules.ExtApi.Asset.GetAvatar ],
  async (logger: Logger,
    pick: Nick.PickNick,
    insertNick: Nick.InsertNick,
    insertAuth: Auth.InsertAuth,
    create: Member.InsertMember,
    updateAvt: Member.UpdateAvatar,
    token: UtilTypes.Auth.CreateMemberToken,
    passphrase: UtilTypes.Auth.CreatePassphrase,
    requestAvatar: ExtApiTypes.Asset.RequestAvatar): Promise<ServiceTypes.CreateMember> =>

    async (param: ServiceTypes.ReqCreateMember) => {
      const created = await create(param);
      const memberNo: number = created.member_no;

      const nick = await pick();
      const memberToken = await token(memberNo);

      let login_id = null;
      let password = null;

      if (param.auth.auth_type === ServiceTypes.AuthType.EMAIL) {
        login_id = param.auth.login_id;
        password = param.auth.password;
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
        ret.passphrase = password;
      }
      return ret;
    });