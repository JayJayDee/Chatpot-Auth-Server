import { MemberService } from "../services/types";
import { RequestHandler } from 'express';

const memberEndpoints =
  (fetch: MemberService.FetchMember) =>
    (): RequestHandler[] => [];
export default memberEndpoints;