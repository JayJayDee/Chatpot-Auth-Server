import * as express from 'express';
import { injectable } from 'smart-factory';
import { HttpConfig } from '../config/types';
import { Modules } from '../modules';
import { Logger } from '../loggers/types';
import { EndpointRouter, EndpointRunner } from './types';
import { errorMiddleware } from './middlewares';

export const endpointRunner = 
  (cfg: HttpConfig,
    log: Logger,
    member: EndpointRouter, 
    errorMid : express.ErrorRequestHandler): EndpointRunner =>
      () => {
        const app = express();
        const routers: EndpointRouter[] = [ member ];
        routers.map((r) => app.use(r.uri, r.router));
        app.use(errorMid);
        app.listen(cfg.port, () => {
          log.info(`http server stared, port:${cfg.port}`);
        });
      };

injectable(Modules.Endpoint.EndpointRunner,
  [Modules.Config.HttpConfig,
    Modules.Logger,
    Modules.Endpoint.Member.Router,
    Modules.Endpoint.Middleware.Error],
  async (cfg: HttpConfig,
    log: Logger,
    member: EndpointRouter,
    errorMid: express.ErrorRequestHandler): Promise<EndpointRunner> =>
      endpointRunner(cfg, log, member, errorMid));

injectable(Modules.Endpoint.Middleware.Error,
  [Modules.Logger, Modules.Config.Env],
  async (log, env) =>
    errorMiddleware(log, env));

export { EndpointRunner } from './types';