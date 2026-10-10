import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

type CreatePatientInput = {
  patient_no: string;
  full_name: string;
  nik?: string;
  gender?: 'MALE' | 'FEMALE';
  birth_date?: Date;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  is_active?: boolean;
};

type ListParams = {
  page: number;
  limit: number;
  search?: string;
};

export const patientService = {
  async list({ page, limit, search }: ListParams) {
    const where: Prisma.patientsWhereInput = search
      ? {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { patient_no: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.patients.count({ where }),
      prisma.patients.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const patient = await prisma.patients.findUnique({ where: { id } });
    if (!patient) throw ApiError.notFound('Pasien tidak ditemukan');
    return patient;
  },

  async create(input: CreatePatientInput) {
    if (input.nik) {
      const nikExists = await prisma.patients.findUnique({ where: { nik: input.nik } });
      if (nikExists) throw ApiError.conflict('NIK sudah dipakai');
    }

    const patientNoExists = await prisma.patients.findUnique({
      where: { patient_no: input.patient_no },
    });
    if (patientNoExists) throw ApiError.conflict('patient_no sudah dipakai');

    return prisma.patients.create({ data: input });
  },

  async update(id: string, input: Partial<CreatePatientInput>) {
    await patientService.getById(id);
    return prisma.patients.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await patientService.getById(id);
    await prisma.patients.delete({ where: { id } });
  },
};
