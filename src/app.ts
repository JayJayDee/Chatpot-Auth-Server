import config from './config';
import initFactory, { resolve, InstanceType } from './factory';

type HttpRunner = () => Promise<void>;

(async () => {
  try {
    const rootConfig = config();
    console.log('chatpot-auth-server starting..');
    console.log(rootConfig);
    await initFactory(rootConfig);

    const runHttp: HttpRunner = resolve(InstanceType.EndpointsRunner);
    await runHttp();
    console.log('chatpot-auth-server started');
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();