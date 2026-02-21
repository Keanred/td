import { NextFunction, Request, Response } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'No error message provided',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
}
