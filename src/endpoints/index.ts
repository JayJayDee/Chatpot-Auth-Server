import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Endpoints,
  [ EndpointModules.Member.CreateSimple,
    EndpointModules.Member.CreateEmail,
    EndpointModules.Member.Get,
    EndpointModules.Auth.AuthEmail,
    EndpointModules.Auth.AuthSimple,
    EndpointModules.Auth.Reauth,
    EndpointModules.Activate.EmailWithPage,
    EndpointModules.Activate.EmailWithPageAction,
    EndpointModules.Activate.AppActivateStatus,
    EndpointModules.Activate.AppRequest,
    EndpointModules.Activate.AppVerify,
    EndpointModules.Internal.GetMultiple ],
  async (mcreates, mcreateem, mget,
    authE, authS, reauth,
    actpage, actpageact, actstat,
    appreq, appveri, intGm): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget,
    authE,
    authS,
    reauth,
    actpage,
    actpageact,
    actstat,
    appreq,
    appveri,
    intGm
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';