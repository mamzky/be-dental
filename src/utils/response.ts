import type { Response } from 'express';

type Meta = Record<string, unknown>;

export const sendSuccess = (
  res: Response,
  data: unknown = null,
  message = 'OK',
  statusCode = 200,
  meta?: Meta,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};

export const sendCreated = (res: Response, data: unknown, message = 'Created') =>
  sendSuccess(res, data, message, 201);