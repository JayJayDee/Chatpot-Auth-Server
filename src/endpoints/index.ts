import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Endpoints,
  [ EndpointModules.Member.CreateSimple,
    EndpointModules.Member.CreateEmail,
    EndpointModules.Member.Get,
    EndpointModules.Member.GetPublic,
    EndpointModules.Member.ChangePassword,
    EndpointModules.Auth.AuthEmail,
    EndpointModules.Auth.AuthSimple,
    EndpointModules.Auth.Reauth,
    EndpointModules.Auth.Logout,
    EndpointModules.Activate.EmailWithPage,
    EndpointModules.Activate.EmailWithPageAction,
    EndpointModules.Activate.AppActivateStatus,
    EndpointModules.Activate.AppRequest,
    EndpointModules.Activate.AppVerify,
    EndpointModules.Abuse.ReportUser,
    EndpointModules.Abuse.GetReports,
    EndpointModules.Gacha.Nick,
    EndpointModules.Gacha.Avatar,
    EndpointModules.Gacha.Status,
    EndpointModules.Internal.GetMultiple ],
  async (mcreates, mcreateem, mget, mgetpub, mchpwd,
    authE, authS, reauth, logout,
    actpage, actpageact, actstat,
    appreq, appveri, abRept, getRept,
    gnick, gprofile, gstatus,
    intGm): Promise<EndpointTypes.Endpoint[]> =>

  ([
    mcreates,
    mcreateem,
    mget,
    mgetpub,
    mchpwd,
    authE,
    authS,
    reauth,
    logout,
    actpage,
    actpageact,
    actstat,
    appreq,
    appveri,
    abRept,
    getRept,
    gnick,
    gprofile,
    gstatus,
    intGm
  ]));

export { EndpointModules } from './modules';
export { EndpointTypes } from './types';