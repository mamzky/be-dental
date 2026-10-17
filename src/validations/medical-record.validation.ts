import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  appointment_id: z.uuid('appointment_id harus berupa uuid'),
  treatment_id: z.uuid('treatment_id harus berupa uuid'),
  dentist_id: z.uuid('dentist_id harus berupa uuid'),
  tooth_number: z.string().min(1).optional(),
  diagnosis: z.string().min(1).optional(),
  procedure_note: z.string().min(1).optional(),
  quantity: z.coerce.number().int('quantity harus bilangan bulat').positive().optional(),
  price: z.coerce.number().nonnegative('price tidak boleh negatif').optional(),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export const medicalRecordIdParam = z.object({
  id: z.uuid('id harus berupa uuid'),
});
