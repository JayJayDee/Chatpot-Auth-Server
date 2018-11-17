import { Endpoint, HttpConfig, KoaWrap, BusinessLogic } from "./types";

const runEndpointWithKoa = (cfg: HttpConfig) =>
  (endpoints: Endpoint[]) => {
    endpoints.map((endpoint: Endpoint) => {
      
    });
  };

export const koaRequestHandler = (logic: BusinessLogic): KoaWrap.RequestHandler =>
  async (ctx, next) => {
    try {
      const param = mergeParam(ctx.request);
      return await logic(param);
    } catch (err) {
      return next(err);
    }
  };

const mergeParam = (request: KoaWrap.Request) =>
  Object.assign({}, request.query, request.body, request.headers);

export default runEndpointWithKoa;