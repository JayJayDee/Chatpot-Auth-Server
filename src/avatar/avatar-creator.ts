import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { CreateAvatar } from './types';

injectable(Modules.Avatar.Create,
  [],
  async (): Promise<CreateAvatar> =>
    async (param) => {
      console.log('-- from avatar-create-function');
      console.log(param);
      return null;
    });