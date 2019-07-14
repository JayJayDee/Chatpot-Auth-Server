import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';

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
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/gacha/:member_token/status',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['params', 'member_token']),
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));