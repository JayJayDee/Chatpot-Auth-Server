import config from './config';
import initFactory from './factory';

(async () => {
  const rootConfig = config();
  console.log('chatpot-auth-server starting..');
  console.log(rootConfig);
  await initFactory(rootConfig);
  console.log('chatpot-auth-server started');
})();