import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { Prisma } from '../generated/prisma/client';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isApiError = err instanceof ApiError;
  const isPrismaError = err instanceof Prisma.PrismaClientKnownRequestError;

  let statusCode = isApiError ? err.statusCode : 500;
  let message = isApiError ? err.message : 'Internal server error';
  const details: unknown = isApiError ? err.details : undefined;

  if (isPrismaError && !isApiError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Data sudah ada (melanggar constraint unik)';
        break;
      case 'P2003':
        statusCode = 409;
        message = 'Data masih direferensikan oleh data lain';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Data tidak ditemukan';
        break;
      default:
        break;
    }
  }

  if (!isApiError && !isPrismaError) {
    console.error(err);
  }

  const body: Record<string, unknown> = {
    success: false,
    message,
  };

  if (details !== undefined) {
    body.details = details;
  }
  if (env.nodeEnv === 'development' && !isApiError && !isPrismaError && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
