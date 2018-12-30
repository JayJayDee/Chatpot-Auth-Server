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
    Env = 'Config/Env',
    
    ConfigSource = 'Config/ConfigSource',
    ConfigReader = 'Config/ConfigReader',
    ConfigParser = 'Config/ConfigParser',
    ConfigRules = 'Config/ConfigRules'
  }

  export namespace Service {
    export enum Member {
      Fetch = 'Service/Member/Fetch',
      Create = 'Service/Member/Create'
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
      Error = 'Endpoint/Middleware/Error'
    }
    export enum Member {
      Router = 'Endpoint/Member/Router',
      Get = 'Endpoint/Member/Get',
      Create = 'Endpoint/Member/Create'
    }
  }

  export namespace Store {
    export enum Member {
      Get = 'Store/Member/Get',
      Insert = 'Store/Member/Insert'
    }
    export enum Nick {
      Pick = 'Store/Nick/Pick',
      Insert = 'Store/Nick/Insert',
      Get = 'Store/Nick/Get'
    }
    export enum Auth {
      Insert = 'Store/Auth/Insert'
    }
  }

  export namespace Util {
    export enum Auth {
      Encrypt = 'Util/Auth/Encrypt',
      Decrypt = 'Util/Auth/Decrypt',
      Passphrase = 'Util/Auth/Passphrase'
    }
  }
}