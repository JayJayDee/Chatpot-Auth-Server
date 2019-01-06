import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { RequestHandler } from 'express';

injectable(Modules.Endpoint.Middleware.InternalAuthenticator,
  [],
  async (): Promise<RequestHandler> =>
    (req, res, next) => {
      // TODO: implementation required.
      next();
    });