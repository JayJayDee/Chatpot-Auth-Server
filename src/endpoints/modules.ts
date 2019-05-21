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
    UpgradeEmail = 'Endpoint/Member/UpgradeEmail'
  }

  export enum Auth {
    AuthSimple = 'Endpoint/Auth/AuthSimple',
    AuthEmail = 'Endpoint/Auth/AuthEmail',
    Reauth = 'Endpoint/Auth/Reauth'
  }

  export enum Activate {
    EmailWithApi = 'Endpoint/Activate/EmailWithApi',
    EmailWithPage = 'Endpoint/Activate/EmailWithPage',
    ActivateStatus = 'Endpoint/Activate/Status'
  }

  export enum Internal {
    GetMultiple = 'Endpoint/Internal/GetMultiple'
  }
}