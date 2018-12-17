import { init, resolve } from "smart-factory";
import { EndpointRunner } from './endpoints';
import { Modules } from './modules';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`]
  });
  const run = <EndpointRunner>resolve(Modules.Endpoint.EndpointRunner);
  await run();
})();