import { injectable } from 'smart-factory';
import { ExtApiTypes } from './types';

import defaultRequestor from './default-requestor';
import { Modules } from '../modules';
import { Logger } from '../loggers/types';

// use default http requestor and register to container.
injectable(Modules.ExtApi.Requestor,
  [ Modules.Logger ],
  async (log: Logger): Promise<ExtApiTypes.Request> =>
    defaultRequestor(log));

export { ExtApiTypes } from './types';