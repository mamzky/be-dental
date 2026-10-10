import type { Request, Response } from 'express';

import { patientService } from '../services/patient.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/response';

export const patientController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const { data, meta } = await patientService.list({ page, limit, search });

    return sendSuccess(res, data, 'OK', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const patient = await patientService.getById(req.params.id as string);
    return sendSuccess(res, patient);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const patient = await patientService.create(req.body);
    return sendCreated(res, patient, 'Pasien berhasil dibuat');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const patient = await patientService.update(req.params.id as string, req.body);
    return sendSuccess(res, patient, 'Pasien berhasil diperbarui');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await patientService.remove(req.params.id as string);
    return sendSuccess(res, null, 'Pasien berhasil dihapus');
  }),
};