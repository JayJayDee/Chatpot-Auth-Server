import { RequestHandler } from 'express';

export const asyncEndpointWrap = (endpoint: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await endpoint(req, res, next);
    } catch (err) {
      return next(err);
    }
  };