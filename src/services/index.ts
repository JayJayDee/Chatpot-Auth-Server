import { fetch, createMember } from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';

injectable(Modules.Service.Member.Fetch,
  [Modules.Logger],
  async (logger: Logger) => fetch(logger));

injectable(Modules.Service.Member.Create,
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Member.Insert ],
  async (logger, pick, insert) =>
    createMember(logger, pick, insert));