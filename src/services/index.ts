import { fetchMember, createMember } from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';

injectable(Modules.Service.Member.Fetch,
  [Modules.Logger,
    Modules.Store.Member.Get,
    Modules.Store.Nick.Get,
    Modules.Util.Auth.Decrypt],
  async (logger, getMember, getNick, decrypt) => 
    fetchMember(logger, getMember, getNick, decrypt));

injectable(Modules.Service.Member.Create,
  [ Modules.Logger,
    Modules.Store.Nick.Pick,
    Modules.Store.Nick.Insert,
    Modules.Store.Auth.Insert,
    Modules.Store.Member.Insert,
    Modules.Util.Auth.Encrypt,
    Modules.Util.Auth.Passphrase ],
  async (logger, pick, insertNick, insertAuth, insert, token, pass) =>
    createMember(logger, pick, insertNick, insertAuth, insert, token, pass));