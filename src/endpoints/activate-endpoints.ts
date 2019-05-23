import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { InvalidParamError, BaseLogicError } from '../errors';
import { StoreModules, StoreTypes } from '../stores';
import { UtilModules, UtilTypes } from '../utils';


injectable(EndpointModules.Activate.EmailWithApi,
  [ EndpointModules.Utils.WrapAync,
    MiddlewareModules.Authorization,
    StoreModules.Activation.Activate,
    UtilModules.Auth.DecryptMemberToken ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    authorize: MiddlewareTypes.Authorization,
    activate: StoreTypes.Activation.Activate,
    decryptMember: UtilTypes.Auth.DecryptMemberToken): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/app/email',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      authorize(['body', 'member_token']),
      wrapAsync(async (req, res, next) => {
        const memberToken = req.query['member_token'];
        const activationCode = req.query['activation_code'];

        if (!memberToken || !activationCode) {
          throw new InvalidParamError('member_token or activation_code required');
        }

        const member = decryptMember(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        await activate({
          member_no: member.member_no,
          activation_code: activationCode
        });
        // TODO: check updated with num_activate_rows

        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Activate.EmailWithPageAction,
  [ EndpointModules.Utils.WrapAync,
    StoreModules.Activation.Activate ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    activate: StoreTypes.Activation.Activate): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/email/action',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const activationCode = req.body['activation_code'];

        if (!activationCode) throw new InvalidParamError('activation_code required');

        const numUpdated = await activate({ activation_code: activationCode });
        console.log(numUpdated);

        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Activate.EmailWithPage,
  [ EndpointModules.Utils.WrapAync,
    StoreModules.Activation.GetActivationStatus ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    activationStatus: StoreTypes.Activation.GetActivationStatus): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/activate/email',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync(async (req, res, next) => {
        const activationCode = req.query.activation_code;

        if (!activationCode) {
          return res.status(200).render('error', {
            message: 'invalid access, please try again.'
          });
        }

        const status = await activationStatus({ activation_code: activationCode });
        if (status === null) {
          return res.status(200).render('error', {
            message: 'invalid activation code.'
          });
        }

        if (status.status === 'CONFIRMED') {
          return res.status(200).render('success', {
            email: status.email,
            message: `Congratulations! your account has been activated.`
          });
        }

        res.status(200).render('activation', {
          email: status.email,
          code: activationCode
        });
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
    uri: '/activate/app/status',
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