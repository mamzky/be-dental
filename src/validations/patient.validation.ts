import { z } from 'zod';

export const createPatientSchema = z.object({
  patient_no: z.string().min(1, 'patient_no wajib diisi'),
  full_name: z.string().min(1, 'full_name wajib diisi'),
  nik: z.string().min(1).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  birth_date: z.coerce.date().optional(),
  phone: z.string().min(1).optional(),
  email: z.email('format email tidak valid').optional(),
  address: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const patientIdParam = z.object({
  id: z.uuid('id harus berupa uuid'),
});