import { NextFunction, Request, Response } from 'express';
import { AppError } from '../db/error/operationErrors';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const appError = err as AppError;
  const status = appError.statusCode ?? 500;
  const code = appError.code ?? 'INTERNAL_ERROR';

  res.status(status).json({
    error: {
      message: err.message || 'No error message provided',
      code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
}
