import { NextFunction, Request, Response } from 'express';
import { AppError } from '../db/error/operationErrors';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message || 'No error message provided',
        code: err.code,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
    });
  }
  console.error('Unexpected error:', err);

  return res.status(500).json({
    error: {
      message: 'Unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
