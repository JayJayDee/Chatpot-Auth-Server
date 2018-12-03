import { fetch } from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';

injectable(Modules.Service.Member.Fetch,
  [Modules.Logger],
  async (logger: Logger) => fetch(logger));