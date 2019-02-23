import { injectable } from 'smart-factory';
import AvatarGenerator from 'avatar-generator';

import { Modules } from '../modules';
import { CreateAvatar } from './types';
import { AvatarCache } from '../stores/types';
import { StorageConfig } from '../config/types';

injectable(Modules.Avatar.Create,
  [ Modules.Store.AvatarCache.Get ],
  async (getFromCache: AvatarCache.Get,
    genAvatar: AvatarGenerator): Promise<CreateAvatar> =>
    async (param) => {
      console.log('-- from avatar-create-function');
      console.log(__dirname);
      console.log(param);
      return null;
    });

injectable(Modules.Avatar.AvatarExtLib,
  [ Modules.Config.StorageConfig ],
  async (cfg: StorageConfig): Promise<AvatarGenerator> =>
    new AvatarGenerator({
      parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
      partsLocation: cfg.avatarAssetPath,
      imageExtension: '.png'
    }));