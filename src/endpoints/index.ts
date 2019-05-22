import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Endpoints,
  [ EndpointModules.Member.CreateSimple,
    EndpointModules.Member.CreateEmail,
    EndpointModules.Member.Get,
    EndpointModules.Member.UpgradeEmail,
    EndpointModules.Auth.AuthEmail,
    EndpointModules.Auth.AuthSimple,
    EndpointModules.Auth.Reauth,
    EndpointModules.Activate.EmailWithApi,
    EndpointModules.Activate.EmailWithPage,
    EndpointModules.Activate.EmailWithPageAction,
    EndpointModules.Activate.ActivateStatus,
    EndpointModules.Internal.GetMultiple ],
  async (mcreates, mcreateem, mget,
    mupg, authE, authS, reauth,
    actapi, actpage, actpageact, actstat, intGm): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget,
    mupg,
    authE,
    authS,
    reauth,
    actapi,
    actpage,
    actpageact,
    actstat,
    intGm
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';