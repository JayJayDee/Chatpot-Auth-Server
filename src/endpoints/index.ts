import { injectable } from "smart-factory";
import { Modules } from '../modules';

injectable(Modules.Endpoint.Member,
  [Modules.Service.MemberService],
  async () => {

  });