import * as express from 'express';
import * as bodyParser from 'body-parser';
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
    auth: EndpointRouter,
    internal: EndpointRouter,
    errorMid: express.ErrorRequestHandler,
    internalAuth: express.RequestHandler,
    notFound: express.RequestHandler): EndpointRunner =>
      () => {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        const routers: EndpointRouter[] = [ member, auth, internal ];
        routers.map((r) => {
          log.info(`[endpt] endpoints-router registered: ${r.uri}`);
          app.use(r.uri, r.router);
        });
        app.use(errorMid);
        app.use(notFound);
        app.listen(cfg.port, () => {
          log.info(`http server stared, port:${cfg.port}`);
        });
      };

injectable(Modules.Endpoint.EndpointRunner,
  [Modules.Config.HttpConfig,
    Modules.Logger,
    Modules.Endpoint.Member.Router,
    Modules.Endpoint.Auth.Router,
    Modules.Endpoint.Internal.Router,
    Modules.Endpoint.Middleware.Error,
    Modules.Endpoint.Middleware.InternalAuthenticator,
    Modules.Endpoint.Middleware.NotFound],
  async (cfg: HttpConfig,
    log: Logger,
    member: EndpointRouter,
    auth: EndpointRouter,
    internal: EndpointRouter,
    errorMid: express.ErrorRequestHandler,
    internalAuth: express.RequestHandler,
    notFound: express.RequestHandler): Promise<EndpointRunner> =>
      endpointRunner(cfg, log, member, auth, internal, errorMid, internalAuth, notFound));

injectable(Modules.Endpoint.Middleware.Error,
  [Modules.Logger, Modules.Config.Env],
  async (log, env) =>
    errorMiddleware(log, env));

export { EndpointRunner } from './types';