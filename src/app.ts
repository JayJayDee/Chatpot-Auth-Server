import config from './config';
import initFactory from './factory';

(async () => {
  try {
    const rootConfig = config();
    console.log('chatpot-auth-server starting..');
    console.log(rootConfig);

    await initFactory(rootConfig);
    console.log('chatpot-auth-server started');
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();