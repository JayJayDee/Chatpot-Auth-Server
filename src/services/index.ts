import { fetchMember, createMember } from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';

injectable(Modules.Service.Member.Fetch,
  [Modules.Logger,
    Modules.Util.Auth.Decrypt,
    Modules.Store.Member.Get],
  async (logger, decrypt, get) => fetchMember(logger, decrypt, get));

injectable(Modules.Service.Member.Create,
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Member.Insert,
    Modules.Util.Auth.Encrypt ],
  async (logger, pick, insert, token) =>
    createMember(logger, pick, insert, token));