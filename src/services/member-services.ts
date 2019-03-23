import { find } from 'lodash';
import { ServiceTypes } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member, Auth } from '../stores/types';
import { AuthUtil } from '../utils/types';
import { injectable } from 'smart-factory';
import { BaseRuntimeError } from '../errors';
import { ExtApiTypes } from '../extapis';
import { ServiceModules } from './modules';
import { Modules } from '../modules';

class AuthFailError extends BaseRuntimeError {}


injectable(ServiceModules.Member.Authenticate,
  [Modules.Logger,
    Modules.Store.Auth.Authenticate,
    Modules.Util.Auth.CreateSesssion],
  async (logger: Logger,
    auth: Auth.Authenticate,
    createSession: AuthUtil.CreateSessionKey): Promise<ServiceTypes.Authenticate> =>

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
    Modules.Util.Auth.Decrypt ],
  async (logger: Logger,
    getMember: Member.GetMember,
    getNick: Nick.GetNick,
    decrypt: AuthUtil.DecryptToken): Promise<ServiceTypes.FetchMember> =>

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


injectable(Modules.Service.Member.FetchMultiple,
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
    Modules.Util.Auth.Encrypt,
    Modules.Util.Auth.Passphrase,
    Modules.ExtApi.Asset.GetAvatar ],
  async (logger: Logger,
    pick: Nick.PickNick,
    insertNick: Nick.InsertNick,
    insertAuth: Auth.InsertAuth,
    create: Member.InsertMember,
    updateAvt: Member.UpdateAvatar,
    token: AuthUtil.CreateToken,
    passphrase: AuthUtil.CreatePassphrase,
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

      const avatar = await requestAvatar(nick.en, param.gender);
      await updateAvt(memberNo, avatar);

      await insertNick({
        member_no: memberNo,
        nick
      });
      await insertAuth({
        login_id,
        password,
        auth_type: param.auth.auth_type,
        member_no: memberNo,
        token: memberToken,
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