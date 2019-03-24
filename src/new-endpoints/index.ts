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
    EndpointModules.Internal.GetMultiple ],
  async (mcreates, mcreateem, mget,
    authE, authS, reauth,
    intGm): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget,
    authE,
    authS,
    reauth,
    intGm
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';