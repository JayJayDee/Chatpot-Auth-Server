import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { InvalidParamError, BaseLogicError } from '../errors';
import { StoreModules, StoreTypes } from '../stores';
import { UtilModules, UtilTypes } from '../utils';


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


class InvalidActivationOperationError extends BaseLogicError {
  constructor(msg: string) {
    super('INVALID_ACTIVATION', msg);
  }
}

injectable(EndpointModules.Activate.ActivateStatus,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    StoreModules.Activation.GetActivationStatus,
    UtilModules.Auth.DecryptMemberToken ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    activationStatus: StoreTypes.Activation.GetActivationStatus,
    decryptMember: UtilTypes.Auth.DecryptMemberToken): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/status',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      authorize(['query', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.query['member_token'];

        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMember(memberToken);
        if (!member) throw new InvalidParamError('invalid member_token');

        const status = await activationStatus({ member_no: member.member_no });
        if (status === null) {
          throw new InvalidActivationOperationError('activation apply not exist');
        }
        res.status(200).json(status);
      })
    ]
  }));