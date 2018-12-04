import * as express from 'express';
import { injectable } from 'smart-factory';
import { HttpConfig } from '../config/types';
import { Modules } from '../modules';
import { Logger } from '../loggers/types';
import { EndpointRouter, EndpointRunner } from './types';

export const endpointRunner = 
  (cfg: HttpConfig,
    log: Logger,
    member: EndpointRouter): EndpointRunner =>
      () => {
        const app = express();
        const routers: EndpointRouter[] = [ member ];
        routers.map((r) => app.use(r.uri, r.router));
        app.listen(cfg.port, () => {
          log.info(`http server stared, port:${cfg.port}`);
        });
      };

injectable(Modules.Endpoint.EndpointRunner,
  [Modules.Config.HttpConfig,
    Modules.Logger,
    Modules.Endpoint.Member.Router],
  async (cfg: HttpConfig,
    log: Logger,
    member: EndpointRouter): Promise<EndpointRunner> =>
      endpointRunner(cfg, log, member));

export { EndpointRunner } from './types';