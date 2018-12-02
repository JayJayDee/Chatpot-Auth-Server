import { init, resolve } from "smart-factory";
import { HttpConfig } from './config/types';
import { Modules } from './modules';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`]
  });
  const httpCfg: HttpConfig = resolve<HttpConfig>(Modules.Config.HttpConfig);
  console.log(`http server listening on ${httpCfg.port}`);
})();