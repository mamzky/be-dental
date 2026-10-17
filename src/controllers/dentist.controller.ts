import type { Request, Response } from 'express';

import { dentistService } from '../services/dentist.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/response';

export const dentistController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const { data, meta } = await dentistService.list({ page, limit, search });

    return sendSuccess(res, data, 'OK', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const dentist = await dentistService.getById(req.params.id as string);
    return sendSuccess(res, dentist);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const dentist = await dentistService.create(req.body);
    return sendCreated(res, dentist, 'Dokter berhasil dibuat');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const dentist = await dentistService.update(req.params.id as string, req.body);
    return sendSuccess(res, dentist, 'Dokter berhasil diperbarui');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await dentistService.remove(req.params.id as string);
    return sendSuccess(res, null, 'Dokter berhasil dihapus');
  }),
};
