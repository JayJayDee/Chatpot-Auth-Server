import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { UtilModules, UtilTypes } from '../utils';
import { InvalidParamError } from '../errors';
import { StoreModules, StoreTypes } from '../stores';

injectable(EndpointModules.Gacha.Nick,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    UtilModules.Auth.DecryptMemberToken,
    StoreModules.Gacha.GachaNick ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    decryptMember: UtilTypes.Auth.DecryptMemberToken,
    gachaNick: StoreTypes.Gacha.GachaNick): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/nick',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMember(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const result = await gachaNick(member.member_no);
        res.status(200).json(result);
      })
    ]
  }));


injectable(EndpointModules.Gacha.Avatar,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    UtilModules.Auth.DecryptMemberToken,
    StoreModules.Gacha.GachaAvatar ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    decryptMember: UtilTypes.Auth.DecryptMemberToken,
    gachaAvatar: StoreTypes.Gacha.GachaAvatar): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/avatar',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMember(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const result = await gachaAvatar(member.member_no);
        res.status(200).json(result);
      })
    ]
  }));


injectable(EndpointModules.Gacha.Status,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    UtilModules.Auth.DecryptMemberToken,
    StoreModules.Gacha.GetStatus ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    decryptMember: UtilTypes.Auth.DecryptMemberToken,
    gachaStatus: StoreTypes.Gacha.GetStatus): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/status',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMember(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const statuses = await gachaStatus(member.member_no);
        res.status(200).json(statuses);
      })
    ]
  }));