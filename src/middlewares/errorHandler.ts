import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  if (!isApiError) {
    console.error(err);
  }

  const body: Record<string, unknown> = {
    success: false,
    message: isApiError ? err.message : 'Internal server error',
  };

  if (isApiError && err.details !== undefined) {
    body.details = err.details;
  }
  if (env.nodeEnv === 'development' && !isApiError && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};