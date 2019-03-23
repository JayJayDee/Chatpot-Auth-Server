import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Endpoints,
  [ EndpointModules.Member.CreateSimple,
    EndpointModules.Member.CreateEmail ],
  async (mcreates,
    mcreateem): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';