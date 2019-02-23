import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { CreateAvatar } from './types';
import { AvatarCache } from '../stores/types';

injectable(Modules.Avatar.Create,
  [ Modules.Store.AvatarCache.Get ],
  async (getFromCache: AvatarCache.Get): Promise<CreateAvatar> =>

    async (param) => {
      console.log('-- from avatar-create-function');
      console.log(param);
      return null;
    });