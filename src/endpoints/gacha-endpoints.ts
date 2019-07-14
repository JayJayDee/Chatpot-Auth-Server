import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { UtilModules, UtilTypes } from '../utils';
import { InvalidParamError } from '../errors';
import { StoreModules, StoreTypes } from '../stores';

injectable(EndpointModules.Gacha.Nick,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/nick',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Gacha.Profile,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/profile',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
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