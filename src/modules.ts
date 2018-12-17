export namespace Modules {
  export enum Config {
    EmptyConfig = 'Config/EmptyConfig',
    RootConfig = 'Config/RootConfig',
    HttpConfig = 'Config/HttpConfig',
    MysqlConfig = 'Config/MysqlConfig',
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

  export namespace Endpoint {
    export const EndpointRunner = 'Endpoint/EndpointRunner';
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
      Pick = 'Store/Nick/Pick'
    }
  }
}