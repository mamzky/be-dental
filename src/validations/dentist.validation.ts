import { z } from 'zod';

export const createDentistSchema = z.object({
  user_id: z.uuid('user_id harus berupa uuid').optional(),
  full_name: z.string().min(1, 'full_name wajib diisi'),
  specialization: z.string().min(1).optional(),
  str_number: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.email('format email tidak valid').optional(),
  notes: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export const updateDentistSchema = createDentistSchema.partial();

export const dentistIdParam = z.object({
  id: z.uuid('id harus berupa uuid'),
});
