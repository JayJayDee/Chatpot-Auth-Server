export namespace Modules {
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
}