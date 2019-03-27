export namespace StoreModules {
  export enum Member {
    GetMember = 'Store/Member/Get',
    GetMembers = 'Store/Member/GetMultiple',
    InsertMember = 'Store/Member/InsertMember',
    UpdateAvatar = 'Store/Member/UpdateAvatar'
  }

  export enum Auth {
    InsertAuth = 'Store/Auth/Insert',
    Authenticate = 'Store/Auth/Authenticate',
    GetPassword = 'Store/Auth/GetPassword'
  }

  export enum Nick {
    PickNick = 'Store/Nick/PickNick',
    InsertNick = 'Store/Nick/InsertNick',
    GetNick = 'Store/Nick/GetNick',
    GetNickMultiple = 'Store/Nick/GetNickMultiple'
  }
}