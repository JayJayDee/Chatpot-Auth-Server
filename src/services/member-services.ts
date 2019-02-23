import { find } from 'lodash';
import { MemberService } from './types';
import { Logger } from '../loggers/types';
import { Nick, Member, Auth } from '../stores/types';
import { AuthUtil } from '../utils/types';
import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { BaseRuntimeError } from '../errors';
import { CreateAvatar } from '../avatar/types';

class AuthFailError extends BaseRuntimeError {}
export const authenticateMember =
  (logger: Logger,
    auth: Auth.Authenticate,
    createSession: AuthUtil.CreateSessionKey): MemberService.Authenticate =>
    async (param) => {
      const result = await auth({
        login_id: param.login_id,
        password: param.password
      });
      if (result.success === false) {
        throw new AuthFailError('AUTH_FAILED', `authentication failed for id:${param.login_id}`);
      }
      const sessionKey = createSession(result.member_no);
      return {
        session_key: sessionKey
      };
    };
injectable(Modules.Service.Member.Authenticate,
  [Modules.Logger,
    Modules.Store.Auth.Authenticate,
    Modules.Util.Auth.CreateSesssion],
  async (log, auth, sess) => authenticateMember(log, auth, sess));

export const fetchMember =
  (logger: Logger,
    getMember: Member.GetMember,
    getNick: Nick.GetNick,
    decrypt: AuthUtil.DecryptToken): MemberService.FetchMember =>
    async (token: string) => {
      const decrypted = decrypt(token);
      const member = await getMember(decrypted.member_no);
      const nick = await getNick({ member_no: decrypted.member_no });
      return {
        nick,
        auth_type: member.auth_type,
        region: member.region,
        language: member.language,
        gender: member.gender,
        token
      };
    };
injectable(Modules.Service.Member.Fetch,
  [Modules.Logger,
    Modules.Store.Member.Get,
    Modules.Store.Nick.Get,
    Modules.Util.Auth.Decrypt],
  async (logger, getMember, getNick, decrypt) =>
    fetchMember(logger, getMember, getNick, decrypt));

export const fetchMemberMultipleWithToken =
  (fetchMembers: MemberService.FetchMembers,
    decrypt: AuthUtil.DecryptToken): MemberService.FetchMembersWithToken =>
  async (tokens: string[]) => {
    const tokenMap = new Map<number, string>();
    const memberNos: number[] = tokens.map((t) => {
      const memberNo = decrypt(t).member_no;
      tokenMap.set(memberNo, t);
      return memberNo;
    });
    const members = await fetchMembers(memberNos);
    members.map((m) => {
      m.token = tokenMap.get(m.member_no);
      delete m.member_no;
      return m;
    });
    return members;
  };
injectable(Modules.Service.Member.FetchMultipleToken,
  [Modules.Service.Member.FetchMultiple,
    Modules.Util.Auth.Decrypt],
  async (fetch, decrypt) => fetchMemberMultipleWithToken(fetch, decrypt));

export const fetchMemberMultiple =
(logger: Logger,
    getMembers: Member.GetMembers,
    getNicks: Nick.GetNickMultiple): MemberService.FetchMembers =>
    async (memberNos: number[]) => {
      const members = await getMembers(memberNos);
      const nicks: Nick.NickMatchEntity[] = await getNicks(memberNos);
      const resp: MemberService.Member[] = members.map((m) => ({
        region: m.region,
        auth_type: m.auth_type,
        language: m.language,
        gender: m.gender,
        nick: {
          en: find(nicks, {member_no: m.no}).en,
          ko: find(nicks, {member_no: m.no}).ko,
          ja: find(nicks, {member_no: m.no}).ja
        },
        member_no: m.no
      }));
      return resp;
    };
injectable(Modules.Service.Member.FetchMultiple,
  [Modules.Logger,
    Modules.Store.Member.GetMultiple,
    Modules.Store.Nick.GetMultiple],
  async (log, getm, ng) => fetchMemberMultiple(log, getm, ng));

export const createMember =
  (logger: Logger,
    pick: Nick.PickNick,
    insertNick: Nick.InsertNick,
    insertAuth: Auth.InsertAuth,
    create: Member.InsertMember,
    token: AuthUtil.CreateToken,
    passphrase: AuthUtil.CreatePassphrase,
    avatar: CreateAvatar): MemberService.CreateMember =>
      async (param: MemberService.ReqCreateMember) => {
        const created = await create(param);
        const memberNo: number = created.member_no;

        const nick = await pick();
        const memberToken = await token(memberNo);
        const pass = passphrase(memberNo);

        const avatarResp = await avatar({ nickEn: nick.en, gender: param.gender });
        console.log(avatarResp);

        await insertNick({
          member_no: memberNo,
          nick
        });
        await insertAuth({
          auth_type: Auth.AuthType.SIMPLE,
          member_no: memberNo,
          login_id: memberToken,
          token: memberToken,
          password: pass
        });
        return {
          nick,
          token: memberToken,
          passphrase: pass
        };
      };
injectable(Modules.Service.Member.Create,
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Nick.Insert,
    Modules.Store.Auth.Insert,
    Modules.Store.Member.Insert,
    Modules.Util.Auth.Encrypt,
    Modules.Util.Auth.Passphrase,
    Modules.Avatar.Create ],
  async (logger, pick, insertNick, insertAuth, insert, token, pass, avatar) =>
    createMember(logger, pick, insertNick, insertAuth, insert, token, pass, avatar));