import config from './config';
import initFactory from './factory';

(async () => {
  const rootConfig = config();
  await initFactory(rootConfig);
})();