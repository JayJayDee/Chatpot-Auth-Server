import memberService from './member-services';
import { Modules } from '../modules';
import { injectable } from 'smart-factory';

injectable(Modules.Service.Member, [],
  async () => memberService());