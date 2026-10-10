import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { ApiError } from '../utils/ApiError';

type Target = 'body' | 'params' | 'query';
type Schemas = Partial<Record<Target, ZodType>>;

export const validate = (schemas: Schemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const details: Record<string, unknown> = {};

    (['body', 'params', 'query'] as const).forEach((target) => {
      const schema = schemas[target];
      if (!schema) return;

      const result = schema.safeParse(req[target]);
      if (!result.success) {
        details[target] = result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return;
      }

      if (target === 'body') {
        req.body = result.data;
      } else {
        Object.assign(req[target], result.data);
      }
    });

    if (Object.keys(details).length > 0) {
      return next(ApiError.badRequest('Validation failed', details));
    }
    return next();
  };
};