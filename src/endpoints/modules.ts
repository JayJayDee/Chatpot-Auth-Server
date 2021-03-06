export namespace EndpointModules {
  export const EndpointRunner = 'Endpoint/EndpointRunner';
  export const Endpoints = 'Endpoint/Endpoints';
  export enum Utils {
    WrapAync = 'Endpoint/Utils/WrapAsync'
  }


  export enum Member {
    CreateSimple = 'Endpoint/Member/CreateSimple',
    CreateEmail = 'Endpoint/Member/CreateEmail',
    Get = 'Endpoint/Member/Get',
    GetPublic = 'Endpoint/Member/GetPublic',
    ChangePassword = 'Endpoint/Auth/ChangePassword'
  }

  export enum Auth {
    AuthSimple = 'Endpoint/Auth/AuthSimple',
    AuthEmail = 'Endpoint/Auth/AuthEmail',
    Reauth = 'Endpoint/Auth/Reauth',
    Logout = 'Endpoint/Auth/Logout'
  }

  export enum Activate {
    AppRequest = 'Endpoint/Activate/App/Request',
    AppVerify = 'Endpoint/Activate/App/Verify',
    EmailWithPageAction = 'Endpoint/Activate/EmailWithPageAction',
    EmailWithPage = 'Endpoint/Activate/EmailWithPage',
    AppActivateStatus = 'Endpoint/Activate/App/Status'
  }

  export enum Abuse {
    ReportUser = 'Endpoint/Abuse/ReportUser',
    GetReports = 'Endpoint/Abuse/GetReports'
  }

  export enum Gacha {
    Nick = 'Gacha/Nick',
    Avatar = 'Gacha/Avatar',
    Status = 'Gacha/Status'
  }

  export enum Internal {
    GetMultiple = 'Endpoint/Internal/GetMultiple'
  }
}