import memberService, { fetch } from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';

injectable(Modules.Service.MemberService,
  [],
  async () => memberService());

injectable(Modules.Service.Member.Fetch,
  [],
  async () => fetch());