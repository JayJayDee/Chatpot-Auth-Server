import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { ExtApiConfig } from '../config/types';
import { ExtApiTypes } from './types';
import { ExtApiModules } from './modules';

injectable(ExtApiModules.Asset.RequestAvatar,
  [ ExtApiModules.Requestor,
    Modules.Config.ExtApiConfig ],
  async (request: ExtApiTypes.Request,
    cfg: ExtApiConfig): Promise<ExtApiTypes.Asset.RequestAvatar> =>

    async (nickEn, gender) => {
      const url = `${cfg.assetHost}/avatar`;
      const resp: any = await request({
        uri: url,
        method: ExtApiTypes.RequestMethod.GET,
        qs: {
          nick: nickEn,
          gender
        }
      });
      return {
        profile_img: resp.profile_img,
        profile_thumb: resp.profile_thumb
      };
    });