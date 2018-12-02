import { init } from "smart-factory";

(async () => {
  await init({
    includes: [`${__dirname}/**/*.ts`],
    debug: true
  });
})();