export namespace UtilModules {
  export enum Auth {
    CreateMemberToken = 'Util/Auth/CreateMemberToken',
    DecryptMemberToken = 'Util/Auth/DecryptMemberToken',
    CrateRoomToken = 'Util/Auth/CreateRoomToken',
    DecryptRoomToken = 'Util/Auth/DecryptRoomToken',
    ValidateSessionKey = 'Util/Auth/ValidateSessionkey',
    RevalidateSessionKey = 'Util/Auth/RevalidateSessionKey',
    CreateSessionKey = 'Util/Auth/CreateSessionKey',
    CreatePassHash = 'Util/Auth/CreatePassHash',
    DecryptPassHash = 'Util/Auth/DecryptPassHash',
    CreatePassphrase = 'Util/Auth/CreatePassphrase',
    CreateEmailPassphrase = 'Util/Auth/CreateEmailPassphrase'
  }

  export enum Ip {
    GetMyIp = 'Util/Ip/GetMyIp'
  }
}