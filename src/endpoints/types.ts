export type BusinessLogic = (param: {[key: string]: any}) => Promise<any>;
export type Endpoint = (uri: string, logic: BusinessLogic) => void;

export type HttpConfig = {
  port: number;
};

export namespace KoaWrap {
  export type Request = {
    query: {[key: string]: any};
    body: {[key: string]: any};
    headers: {[key: string]: any};
  };
  export type Context = {
    request: Request;
  };
  export type NextFunction = (error: any) => Promise<any>;
  export type RequestHandler = (ctx: Context, next?: NextFunction) => Promise<any>;
}