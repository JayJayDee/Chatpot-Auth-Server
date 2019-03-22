export namespace Modules {
  export enum Error {
    BaseInitError = 'Error/BaseInitError',
    BaseRuntimeError = 'Error/BaseRuntimeError',
    InvalidParamError = 'Error/InvalidParam'
  }

  export enum Config {
    EmptyConfig = 'Config/EmptyConfig',
    RootConfig = 'Config/RootConfig',
    HttpConfig = 'Config/HttpConfig',
    MysqlConfig = 'Config/MysqlConfig',
    CredentialConfig = 'Config/CredentialConfig',
    CacheConfig = 'Config/CacheConfig',
    StorageConfig = 'Config/StorageConfig',
    ExtApiConfig = 'Config/ExtApiConfig',
    Env = 'Config/Env',

    ConfigSource = 'Config/ConfigSource',
    ConfigReader = 'Config/ConfigReader',
    ConfigParser = 'Config/ConfigParser',
    ConfigRules = 'Config/ConfigRules'
  }

  export namespace Service {
    export enum Member {
      Fetch = 'Service/Member/Fetch',
      FetchMultiple = 'Service/Member/FetchMultiple',
      Create = 'Service/Member/Create',
      Authenticate = 'Service/Member/Authenticate'
    }
  }

  export const Logger = 'Logger';
  export const Mysql = 'Mysql';

  export namespace Cache {
    export const Get = 'Cache/Get';
    export const Set = 'Cache/Set';
    export const Operations = 'Cache/Operations';
    export const Helper = 'Cache/Helper';
  }

  export namespace Endpoint {
    export const EndpointRunner = 'Endpoint/EndpointRunner';
    export enum Middleware {
      Error = 'Endpoint/Middleware/Error',
      Authenticator = 'Endpoint/Middleware/Authenticator',
      InternalAuthenticator = 'Endpoint/Middleware/InternalAuthenticator',
      NotFound = 'Endpoint/Middleware/NotFound'
    }
    export enum Member {
      Router = 'Endpoint/Member/Router',
      Get = 'Endpoint/Member/Get',
      Create = 'Endpoint/Member/Create',
      CreateEmail = 'Endpoint/Member/CreateEmail'
    }
    export enum Internal {
      Router = 'Endpoint/Internal/Router',
      Get = 'Endpoint/Internal/Get'
    }
    export enum Auth {
      Router = 'Endpoint/Auth/Router',
      Auth = 'Endpoint/Auth/Auth',
      Reauth = 'Endpoint/Auth/Reauth',
      EmailLogin = 'Endpoint/Member/EmailLogin'
    }
  }

  export namespace Store {
    export enum Member {
      Get = 'Store/Member/Get',
      GetMultiple = 'Store/Member/GetMultiple',
      Insert = 'Store/Member/Insert',
      UpdateAvatar = 'Store/Member/UpdateAvatar'
    }
    export enum Nick {
      Pick = 'Store/Nick/Pick',
      Insert = 'Store/Nick/Insert',
      Get = 'Store/Nick/Get',
      GetMultiple = 'Store/Nick/GetMultiple'
    }
    export enum Auth {
      Insert = 'Store/Auth/Insert',
      Authenticate = 'Store/Auth/Authenticate',
      GetPassword = 'Store/Auth/GetPassword'
    }
  }

  export namespace Util {
    export enum Auth {
      Encrypt = 'Util/Auth/Encrypt',
      Decrypt = 'Util/Auth/Decrypt',
      Passphrase = 'Util/Auth/Passphrase',
      PassHash = 'Util/Auth/PassHash',
      DecryptPassHash = 'Util/Auth/DecryptPassHash',
      CreateSesssion = 'Util/Auth/CreateSession',
      ValidateSession = 'Util/Auth/ValidateSession',
      RevalidateSession = 'Util/Auth/RevalidateSession'
    }
  }

  export namespace ExtApi {
    export const Requestor = 'ExtApi/Requestor';

    export enum Asset {
      GetAvatar = 'ExtApi/Asset/GetAvatar'
    }
  }
}