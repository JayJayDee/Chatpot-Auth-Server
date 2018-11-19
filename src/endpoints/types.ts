export type BusinessLogic = (param: {[key: string]: any}) => Promise<any>;
export enum HttpMethod {
  POST = 'post', GET = 'get'
}
export type Endpoint = {
  uri: string;
  method: HttpMethod;
  logic: BusinessLogic;
}

export type HttpConfig = {
  port: number;
};

export type EndpointParam = {[key: string]: any};

export namespace KoaWrap {
  export type Application = {
    use: (handler: RequestHandler) => Promise<any>;
    get: (uri: string, handler: RequestHandler) => Promise<any>;
    post: (uri: string, handler: RequestHandler) => Promise<any>;
    listen: (port: number) => void;
  };
  export type Request = {
    query: {[key: string]: any};
    body: {[key: string]: any};
    headers: {[key: string]: any};
    get: any;
  };
  export type Response = {
    body: any;
    status: number;
  };
  export type Context = {
    request: Request;
    response: Response;
    query: {[key: string]: any};
  };
  export type NextFunction = (error: any) => Promise<any>;
  export type RequestHandler = (ctx: Context, next?: NextFunction) => Promise<any>;
}