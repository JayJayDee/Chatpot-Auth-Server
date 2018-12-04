import { RequestHandler, Router } from 'express';

export enum EndpointMethod {
  POST = 'post', GET = 'get' 
}
export type Endpoint = {
  uri: string;
  handler: RequestHandler[];
  method: EndpointMethod;
};
export type EndpointRouter = {
  uri: string;
  router: Router;
};

export type EndpointRunner = () => void;