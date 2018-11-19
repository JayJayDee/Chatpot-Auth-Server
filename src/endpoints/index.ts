import * as Koa from 'koa';
import * as Router from 'koa-router';

import { HttpConfig, HttpMethod } from './types';
import runEndpoints from './http-koa-runner';

const init = async (cfg: HttpConfig) => {
  const koa = new Koa();
  const router = new Router();
  return () => {
    return new Promise((resolve, reject) => {
      const run = runEndpoints(cfg, router);
      run([
        {
          uri: '/',
          method: HttpMethod.GET,
          logic: async (param) => {
            return {
              test: 'test'
            };
          }
        }
      ]).then(() => {
        koa.use(router.routes());
        koa.listen(cfg.port, null, null, () => {
          console.log(`http-server started at port:${cfg.port}`);
          resolve();
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  };
};
export default init;