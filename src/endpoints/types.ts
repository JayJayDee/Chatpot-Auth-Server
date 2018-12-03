import { RequestHandler } from 'express';

export enum EndpointMethod {
  POST = 'post', GET = 'get' 
}
export type Endpoint = {
  uri: string;
  handler: RequestHandler[];
  method: EndpointMethod;
};