import { injectable } from 'smart-factory';
import { Modules } from '../modules';
import { RequestHandler } from 'express';

injectable(Modules.Endpoint.Middleware.NotFound,
  [],
  async (): Promise<RequestHandler> =>
    (req, res, next) => {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: `resource not found: ${req.url}`
      });
    });