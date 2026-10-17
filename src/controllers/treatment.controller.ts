import type { Request, Response } from 'express';

import { treatmentService } from '../services/treatment.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/response';

export const treatmentController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const { data, meta } = await treatmentService.list({ page, limit, search });

    return sendSuccess(res, data, 'OK', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const treatment = await treatmentService.getById(req.params.id as string);
    return sendSuccess(res, treatment);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const treatment = await treatmentService.create(req.body);
    return sendCreated(res, treatment, 'Tindakan berhasil dibuat');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const treatment = await treatmentService.update(req.params.id as string, req.body);
    return sendSuccess(res, treatment, 'Tindakan berhasil diperbarui');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await treatmentService.remove(req.params.id as string);
    return sendSuccess(res, null, 'Tindakan berhasil dihapus');
  }),
};
