import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { ExtApiTypes } from './types';
import { ExtApiConfig } from '../config/types';

injectable(Modules.ExtApi.Asset.GetAvatar,
  [ Modules.ExtApi.Requestor,
    Modules.Config.ExtApiConfig ],
  async (request: ExtApiTypes.Request,
    cfg: ExtApiConfig): Promise<ExtApiTypes.Asset.RequestAvatar> =>

    async (nickEn, gender) => {
      return null;
    });