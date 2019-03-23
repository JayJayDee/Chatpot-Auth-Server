import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Endpoints,
  [ EndpointModules.Member.CreateSimple,
    EndpointModules.Member.CreateEmail,
    EndpointModules.Member.Get ],
  async (mcreates,
    mcreateem,
    mget): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';