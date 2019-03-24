import { injectable } from 'smart-factory';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Application } from 'express';

import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { Modules } from '../modules';
import { Logger } from '../loggers/types';
import { HttpConfig } from '../config/types';

injectable(EndpointModules.EndpointRunner,

  [Modules.Config.HttpConfig,
    Modules.Logger,
    EndpointModules.Endpoints,
    MiddlewareModules.Error,
    MiddlewareModules.NotFound],

  async (cfg: HttpConfig,
    log: Logger,
    endpoints: EndpointTypes.Endpoint[],
    error: MiddlewareTypes.Error,
    notFound: MiddlewareTypes.NotFound): Promise<EndpointTypes.EndpointRunner> =>

    () => {
      const app = express();
      app.use(bodyParser.urlencoded({ extended: true }));
      registerEndpoints(app, endpoints, log);
      app.use(error);
      app.use(notFound);

      app.listen(cfg.port, () => {
        log.info(`[http] http server stared with port: ${cfg.port}`);
      });
    });

const registerEndpoints =
  (app: Application,
    endpoints: EndpointTypes.Endpoint[],
    log: Logger) => {
    endpoints.map((e) => {
      if (e.method === EndpointTypes.EndpointMethod.GET) {
        app.get(e.uri, e.handler);
      } else if (e.method === EndpointTypes.EndpointMethod.POST) {
        app.post(e.uri, e.handler);
      }
      log.info(`[http] endpoint registered: ${e.method} ${e.uri}`);
    });
  };