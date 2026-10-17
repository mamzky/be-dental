import type { Request, Response } from 'express';

import { appointmentService } from '../services/appointment.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/response';
import {
  appointmentStatuses,
  type AppointmentStatus,
} from '../validations/appointment.validation';

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseStatus = (value: unknown): AppointmentStatus | undefined => {
  if (typeof value !== 'string') return undefined;
  return (appointmentStatuses as readonly string[]).includes(value)
    ? (value as AppointmentStatus)
    : undefined;
};

export const appointmentController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = parseStatus(req.query.status);
    const patient_id = typeof req.query.patient_id === 'string' ? req.query.patient_id : undefined;
    const dentist_id = typeof req.query.dentist_id === 'string' ? req.query.dentist_id : undefined;
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);

    const { data, meta } = await appointmentService.list({
      page,
      limit,
      status,
      patient_id,
      dentist_id,
      from,
      to,
    });

    return sendSuccess(res, data, 'OK', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.getById(req.params.id as string);
    return sendSuccess(res, appointment);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.create(req.body);
    return sendCreated(res, appointment, 'Jadwal berhasil dibuat');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const appointment = await appointmentService.update(req.params.id as string, req.body);
    return sendSuccess(res, appointment, 'Jadwal berhasil diperbarui');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await appointmentService.remove(req.params.id as string);
    return sendSuccess(res, null, 'Jadwal berhasil dihapus');
  }),
};
