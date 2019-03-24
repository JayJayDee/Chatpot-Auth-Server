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

  export const Logger = 'LoggerOld';
  export const Mysql = 'MysqlOld';

  export namespace Cache {
    export const Get = 'Cache/GetOld';
    export const Set = 'Cache/SetOld';
    export const Operations = 'Cache/OperationsOld';
    export const Helper = 'Cache/HelperOld';
  }

  export namespace Endpoint {
    export const EndpointRunner = 'Endpoint/EndpointRunnerOld';
    export enum Middleware {
      Error = 'Endpoint/Middleware/Error',
      Authenticator = 'Endpoint/Middleware/Authenticator',
      InternalAuthenticator = 'Endpoint/Middleware/InternalAuthenticator',
      NotFound = 'Endpoint/Middleware/NotFound'
    }
    export enum Member {
      Router = 'Endpoint/Member/RouterOld',
      Get = 'Endpoint/Member/GetOld',
      Create = 'Endpoint/Member/CreateOld',
      CreateEmail = 'Endpoint/Member/CreateEmailOld'
    }
    export enum Internal {
      Router = 'Endpoint/Internal/RouterOld',
      Get = 'Endpoint/Internal/GetOld'
    }
    export enum Auth {
      Router = 'Endpoint/Auth/RouterOld',
      Auth = 'Endpoint/Auth/AuthOld',
      Reauth = 'Endpoint/Auth/ReauthOld',
      EmailLogin = 'Endpoint/Member/EmailLoginOld'
    }
  }

  export namespace Store {
    export enum Member {
      Get = 'Store/Member/GetOld',
      GetMultiple = 'Store/Member/GetMultipleOld',
      Insert = 'Store/Member/InsertOld',
      UpdateAvatar = 'Store/Member/UpdateAvatarOld'
    }
    export enum Nick {
      Pick = 'Store/Nick/PickOld',
      Insert = 'Store/Nick/InsertOld',
      Get = 'Store/Nick/GetOld',
      GetMultiple = 'Store/Nick/GetMultipleOld'
    }
    export enum Auth {
      Insert = 'Store/Auth/InsertOld',
      Authenticate = 'Store/Auth/AuthenticateOld',
      GetPassword = 'Store/Auth/GetPasswordOld'
    }
  }

  export namespace Util {
    export enum Auth {
      Encrypt = 'Util/Auth/EncryptOld',
      Decrypt = 'Util/Auth/DecryptOld',
      Passphrase = 'Util/Auth/PassphraseOld',
      PassHash = 'Util/Auth/PassHashOld',
      DecryptPassHash = 'Util/Auth/DecryptPassHashOld',
      CreateSesssion = 'Util/Auth/CreateSessionOld',
      ValidateSession = 'Util/Auth/ValidateSessionOld',
      RevalidateSession = 'Util/Auth/RevalidateSessionOld'
    }
  }

  export namespace ExtApi {
    export const Requestor = 'ExtApi/RequestorOld';

    export enum Asset {
      GetAvatar = 'ExtApi/Asset/GetAvatarOld'
    }
  }
}