import { injectable } from 'smart-factory';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';

import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { MiddlewareModules, MiddlewareTypes } from '../middlewares';
import { LoggerTypes, LoggerModules } from '../loggers';
import { ConfigModules, ConfigTypes } from '../config';
import { SwaggerModules } from '../swagger';
import { SwaggerTypes } from '../swagger/types';
import { PageModules, PageTypes } from '../pages';

injectable(EndpointModules.EndpointRunner,

  [ ConfigModules.HttpConfig,
    LoggerModules.Logger,
    EndpointModules.Endpoints,
    MiddlewareModules.Error,
    MiddlewareModules.NotFound,
    SwaggerModules.SwaggerRegisterer,
    PageModules.PagesRegisterer],

  async (cfg: ConfigTypes.HttpConfig,
    log: LoggerTypes.Logger,
    endpoints: EndpointTypes.Endpoint[],
    error: MiddlewareTypes.Error,
    notFound: MiddlewareTypes.NotFound,
    swagger: SwaggerTypes.SwaggerRegisterer,
    pages: PageTypes.PagesRegisterer): Promise<EndpointTypes.EndpointRunner> =>

    () => {
      const app = express();
      app.set('etag', false);
      pages(app);
      app.use(cors());
      app.use(bodyParser.urlencoded({ extended: true }));
      swagger(app);
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
    log: LoggerTypes.Logger) => {
    endpoints.map((e) => {
      if (e.method === EndpointTypes.EndpointMethod.GET) {
        app.get(e.uri, e.handler);
      } else if (e.method === EndpointTypes.EndpointMethod.POST) {
        app.post(e.uri, e.handler);
      }
      log.info(`[http] endpoint registered: ${e.method} ${e.uri}`);
    });
  };