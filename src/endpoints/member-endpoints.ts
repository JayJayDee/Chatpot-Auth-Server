import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { UtilModules, UtilTypes } from '../utils';
import { GeoIpModules, GeoIpTypes } from '../geoip';
import { StoreModules, StoreTypes } from '../stores';


injectable(EndpointModules.Member.CreateSimple,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Create,
    UtilModules.Ip.GetMyIp,
    GeoIpModules.GetRegionCode ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    createMember: ServiceTypes.CreateMember,
    getIp: UtilTypes.Ip.GetMyIp,
    getRegionCode: GeoIpTypes.GetRegionCode): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        if (!req.body['language']) {
          throw new InvalidParamError('language required');
        }
        const ip = getIp(req);
        const region = getRegionCode(ip);
        const language = req.body['language'];
        const genderExpr = req.body['gender'];
        const auth = {
          auth_type: ServiceTypes.AuthType.SIMPLE
        };

        const gender = parseGender(genderExpr);
        const param = { region, language, gender, auth };
        const resp = await createMember(param);
        res.status(200).json(resp);
      })
    ]
  }));

const parseGender = (genderExpr: string): ServiceTypes.MemberGender =>
  genderExpr === 'M' ? ServiceTypes.MemberGender.M :
  genderExpr === 'F' ? ServiceTypes.MemberGender.F :
  ServiceTypes.MemberGender.NOT_YET;


injectable(EndpointModules.Member.CreateEmail,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Create,
    UtilModules.Ip.GetMyIp,
    GeoIpModules.GetRegionCode ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    create: ServiceTypes.CreateMember,
    getIp: UtilTypes.Ip.GetMyIp,
    getRegionCode: GeoIpTypes.GetRegionCode): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const ip = getIp(req);
        const region = getRegionCode(ip);

        const email = req.body['email'];
        const password = req.body['password'];
        const language = req.body['language'];
        const genderExpr = req.body['gender'];

        if (!email || !password || !language) {
          throw new InvalidParamError('email, password, language required');
        }

        const auth = {
          auth_type: ServiceTypes.AuthType.EMAIL,
          login_id: email,
          password
        };

        const gender = parseGender(genderExpr);

        const param = { region, language, gender, auth };
        const resp = await create(param);
        res.status(200).json(resp);
      })
    ]
  }));


injectable(EndpointModules.Member.Get,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    ServiceModules.Member.Fetch,
    UtilModules.Auth.DecryptMemberToken ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    fetchMember: ServiceTypes.FetchMember,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member/:member_token',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const token: string = req.params['member_token'];
        if (!token) throw new InvalidParamError('member_token required');

        const decrypted = decryptMemberToken(token);
        if (!decrypted) throw new InvalidParamError('invalid member_token');

        const member = await fetchMember(token);
        res.status(200).json(member);
      })
    ]
  }));


injectable(EndpointModules.Member.ChangePassword,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    StoreModules.Member.ChangePassword,
    UtilModules.Auth.DecryptMemberToken,
    UtilModules.Auth.CreateEmailPassphrase ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    changePassword: StoreTypes.Member.ChangePassword,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    emailPassphrase: UtilTypes.Auth.CreateEmailPassphrase) =>

  ({
    uri: '/member/:member_token/password',
    method: EndpointTypes.EndpointMethod.PUT,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        const current_password = req.body['current_password'];
        const new_password = req.body['new_password'];

        if (!memberToken || !current_password || !new_password) {
          throw new InvalidParamError('current_password, new_password required');
        }

        const member = decryptMemberToken(memberToken);
        if (member === null) {
          throw new InvalidParamError('invalid member_token');
        }

        await changePassword({
          member_no: member.member_no,
          current_password,
          new_password
        });

        res.status(200).json({
          passphrase: emailPassphrase(new_password)
        });
      })
    ]
  }));


type MemberPublic = {
  region: string;
  region_name: string;
  language: string;
  gender: string;
  nick: ServiceTypes.Nick;
  avatar: ServiceTypes.Avatar;
  token: string;
};

const cvtToPublic = (member: ServiceTypes.Member): MemberPublic => ({
  region: member.region,
  region_name: member.region_name,
  language: member.language,
  gender: member.gender,
  nick: member.nick,
  avatar: member.avatar,
  token: member.token
});

injectable(EndpointModules.Member.GetPublic,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authentication,
    ServiceModules.Member.Fetch ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authenticate: MiddlewareTypes.Authentication,
    fetchMember: ServiceTypes.FetchMember): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member/:member_token/public',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authenticate,
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];

        if (!memberToken) {
          throw new InvalidParamError('member_token required');
        }

        const member = await fetchMember(memberToken);
        res.status(200).json(cvtToPublic(member));
      })
    ]
  }));