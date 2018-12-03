import { init, resolve } from "smart-factory";
import { HttpConfig } from './config/types';
import { Modules } from './modules';
import { Logger } from './loggers/types';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`]
  });
  const httpCfg = resolve<HttpConfig>(Modules.Config.HttpConfig);
  const log = resolve<Logger>(Modules.Logger);
  
  log.info(`http server listening on ${httpCfg.port}`);
})();