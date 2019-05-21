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
    EndpointModules.Activate.Email,
    EndpointModules.Internal.GetMultiple ],
  async (mcreates, mcreateem, mget,
    mupg, authE, authS, reauth,
    activate, intGm): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget,
    mupg,
    authE,
    authS,
    reauth,
    activate,
    intGm
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';