import { init, resolve } from "smart-factory";
import { EndpointRunner } from './endpoints';
import { Modules } from './modules';

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`],
    debug: true
  });
  const run = <EndpointRunner>resolve(Modules.Endpoint.EndpointRunner);
  await run();
})();