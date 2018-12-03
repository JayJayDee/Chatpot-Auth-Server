import { init, resolve } from "smart-factory";
import { HttpConfig, Env } from './config/types';
import { Modules } from './modules';
import { Logger } from './loggers/types';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`],
  });
  const httpCfg = resolve<HttpConfig>(Modules.Config.HttpConfig);
  const log = resolve<Logger>(Modules.Logger);
  const env = resolve<Env>(Modules.Config.Env);
  
  log.info(`chatpot-auth server started. port:${httpCfg.port}, env:${env}`);
})();