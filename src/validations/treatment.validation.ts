import { z } from 'zod';

export const createTreatmentSchema = z.object({
  code: z.string().min(1, 'code wajib diisi'),
  name: z.string().min(1, 'name wajib diisi'),
  description: z.string().min(1).optional(),
  price: z.coerce.number().nonnegative('price tidak boleh negatif').optional(),
  duration_minutes: z.coerce
    .number()
    .int('duration_minutes harus bilangan bulat')
    .positive('duration_minutes harus positif')
    .optional(),
  is_active: z.boolean().optional(),
  is_bpjs_enable: z.boolean().optional(),
});

export const updateTreatmentSchema = createTreatmentSchema.partial();

export const treatmentIdParam = z.object({
  id: z.uuid('id harus berupa uuid'),
});
