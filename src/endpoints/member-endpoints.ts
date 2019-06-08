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
        if (!req.body['language'] || !req.body['gender']) {
          throw new InvalidParamError('language, gender');
        }
        const ip = getIp(req);
        const region = getRegionCode(ip);
        const language = req.body['language'];
        const gender = req.body['gender'];
        const auth = {
          auth_type: ServiceTypes.AuthType.SIMPLE
        };

        const param = { region, language, gender, auth };
        const resp = await createMember(param);
        res.status(200).json(resp);
      })
    ]
  }));


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
        const gender = req.body['gender'];

        if (!email || !password || !language || !gender) {
          throw new InvalidParamError('email, password, language, gender required');
        }

        const auth = {
          auth_type: ServiceTypes.AuthType.EMAIL,
          login_id: email,
          password
        };

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