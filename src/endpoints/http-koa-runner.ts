import { Endpoint, HttpConfig, KoaWrap, BusinessLogic, HttpMethod } from "./types";

const runEndpoints = (cfg: HttpConfig, koaRouter: any) =>
  (endpoints: Endpoint[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const mapRouter = mapKoaRunner(koaRouter);
      endpoints.map((endpoint: Endpoint) => {
        const method = mapRouter(endpoint.method);
        method.apply(koaRouter, [endpoint.uri, async (ctx: KoaWrap.Context, next: KoaWrap.NextFunction) => {
          const params = mergeParams(ctx);
          const resp = await endpoint.logic(params);
          ctx.response.body = resp;
          ctx.response.status = 200;
        }]);
      });
      resolve();
    });
  };

const mapKoaRunner = (koaRouter: any) =>
  (method: HttpMethod) => {
    if (method === HttpMethod.GET) return koaRouter.get;
    else if (method === HttpMethod.POST) return koaRouter.post;
    return null;
  };

export const koaRequestHandler = (logic: BusinessLogic): KoaWrap.RequestHandler =>
  async (ctx: KoaWrap.Context, next: KoaWrap.NextFunction) => {
    try {
      const param = mergeParams(ctx);
      return await logic(param);
    } catch (err) {
      return next(err);
    }
  };

const mergeParams = (ctx: KoaWrap.Context) =>
  Object.assign({}, ctx.query, ctx.request.body, ctx.request.headers);

export default runEndpoints;