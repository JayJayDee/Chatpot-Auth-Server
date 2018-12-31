import { ErrorRequestHandler } from 'express';
import { BaseRuntimeError, BaseAuthError } from '../errors';
import { Logger } from '../loggers/types';
import { Env } from '../config/types';

type ErrorResponse = {
  status: number;
  payload: ErrorPayload;
};

type ErrorPayload = {
  code: string;
  message: string;
};

export const errorMiddleware =
  (log: Logger, env: Env): ErrorRequestHandler =>
    (err, req, res, next) => {
      const resp = errorResponse(log, err);
      res.status(resp.status).json(resp.payload);
    };

export const errorResponse = (log: Logger, err: Error): ErrorResponse => {
  const resp: ErrorResponse = {
    status: 400,
    payload: {
      code: null,
      message: null
    }
  };

  if (err instanceof BaseRuntimeError || err instanceof BaseAuthError) {
    resp.status = 400;
    if (err instanceof BaseAuthError) resp.status = 401;
    resp.payload.code = err.code;
    resp.payload.message = err.message;
  } else {
    log.error(err);
    resp.status = 500;
    resp.payload.code = 'INTERNAL_SERVER_ERROR';
    resp.payload.message = 'internal server error occured';
  }
  return resp;
};