import { z } from 'zod';

export const appointmentStatuses = [
  'SCHEDULED',
  'RESCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const appointmentStatusEnum = z.enum(appointmentStatuses);

export const createAppointmentSchema = z.object({
  patient_id: z.uuid('patient_id harus berupa uuid'),
  dentist_id: z.uuid('dentist_id harus berupa uuid'),
  scheduled_at: z.coerce.date(),
  status: appointmentStatusEnum.optional(),
  complaint: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const appointmentIdParam = z.object({
  id: z.uuid('id harus berupa uuid'),
});
