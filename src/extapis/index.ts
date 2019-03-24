import { injectable } from 'smart-factory';
import { ExtApiTypes } from './types';
import { ExtApiModules } from './modules';

import defaultRequestor from './default-requestor';
import { LoggerModules, LoggerTypes } from '../loggers-new';

// use default http requestor and register to container.
injectable(ExtApiModules.Requestor,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<ExtApiTypes.Request> =>
    defaultRequestor(log));

export { ExtApiTypes } from './types';
export { ExtApiModules } from './modules';