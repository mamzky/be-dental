import type { Request, Response } from 'express';

import { medicalRecordService } from '../services/medical-record.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/response';

export const medicalRecordController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const appointment_id =
      typeof req.query.appointment_id === 'string' ? req.query.appointment_id : undefined;
    const dentist_id = typeof req.query.dentist_id === 'string' ? req.query.dentist_id : undefined;
    const treatment_id =
      typeof req.query.treatment_id === 'string' ? req.query.treatment_id : undefined;

    const { data, meta } = await medicalRecordService.list({
      page,
      limit,
      appointment_id,
      dentist_id,
      treatment_id,
    });

    return sendSuccess(res, data, 'OK', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.getById(req.params.id as string);
    return sendSuccess(res, record);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.create(req.body);
    return sendCreated(res, record, 'Rekam medis berhasil dibuat');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.update(req.params.id as string, req.body);
    return sendSuccess(res, record, 'Rekam medis berhasil diperbarui');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await medicalRecordService.remove(req.params.id as string);
    return sendSuccess(res, null, 'Rekam medis berhasil dihapus');
  }),
};
