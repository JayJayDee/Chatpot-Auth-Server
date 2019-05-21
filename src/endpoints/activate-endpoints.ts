import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { InvalidParamError } from '../errors';


injectable(EndpointModules.Activate.EmailWithApi,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['body', 'member_token']),
      wrapAsync((req, res, next) => {
        const memberToken = req.query['member_token'];
        const activationCode = req.query['activation_code'];

        if (!memberToken || !activationCode) throw new InvalidParamError('member_token or activation_code required');

        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Activate.EmailWithPage,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/page/email',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync((req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Activate.ActivateStatus,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/status',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['query', 'member_token']),
      wrapAsync((req, res, next) => {
        const memberToken = req.query['member_token'];
        const activationCode = req.query['activation_code'];

        if (!memberToken || !activationCode) throw new InvalidParamError('member_token or activation_code required');

        res.status(200).json({});
      })
    ]
  }));