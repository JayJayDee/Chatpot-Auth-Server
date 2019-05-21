import { injectable } from 'smart-factory';
import { createHash } from 'crypto';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ServiceModules, ServiceTypes } from '../services';
import { InvalidParamError } from '../errors';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { UtilModules, UtilTypes } from '../utils';
import { StoreModules, StoreTypes } from '../stores';
import { MailerModules, MailerTypes } from '../mailer';

injectable(EndpointModules.Member.CreateSimple,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Create ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    createMember: ServiceTypes.CreateMember): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        if (!req.body['region'] || !req.body['language'] || !req.body['gender']) {
          throw new InvalidParamError('region, language, gender');
        }
        const region = req.body['region'];
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


const generateCode = (memberNo: number, email: string) =>
  createHash('sha1')
    .update(`${memberNo}${email}${Date.now()}`)
    .digest('hex');

injectable(EndpointModules.Member.UpgradeEmail,
  [ EndpointModules.Utils.WrapAync,
    UtilModules.Auth.DecryptMemberToken,
    StoreModules.Member.CreateEmailAuth,
    MailerModules.SendActivationMail ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    createEmailAuth: StoreTypes.Member.CreateEmailAuth,
    sendMail: MailerTypes.SendActivationMail): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member/:member_token/upgrade/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        const email = req.body['email'];

        if (!memberToken || !email) {
          throw new InvalidParamError('member_token or email required');
        }

        const member = decryptMemberToken(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const code = generateCode(member.member_no, email);

        sendMail(email);
        await createEmailAuth({
          code,
          email,
          member_no: member.member_no
        });
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Member.CreateEmail,
  [ EndpointModules.Utils.WrapAync,
    ServiceModules.Member.Create ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    create: ServiceTypes.CreateMember): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/member/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const email = req.body['email'];
        const password = req.body['password'];
        const region = req.body['region'];
        const language = req.body['language'];
        const gender = req.body['gender'];

        if (!email || !password || !region || !language || !gender) {
          throw new InvalidParamError('email, password, region, language, gender required');
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