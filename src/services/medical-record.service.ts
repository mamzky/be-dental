import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

type CreateMedicalRecordInput = {
  appointment_id: string;
  treatment_id: string;
  dentist_id: string;
  tooth_number?: string;
  diagnosis?: string;
  procedure_note?: string;
  quantity?: number;
  price?: number;
};

type ListParams = {
  page: number;
  limit: number;
  appointment_id?: string;
  dentist_id?: string;
  treatment_id?: string;
};

const include = {
  treatments: { select: { id: true, code: true, name: true, price: true } },
  appointments: { select: { id: true, scheduled_at: true, patient_id: true, dentist_id: true } },
  dentists: { select: { id: true, full_name: true } },
} satisfies Prisma.medical_recordsInclude;

export const medicalRecordService = {
  async list({ page, limit, appointment_id, dentist_id, treatment_id }: ListParams) {
    const where: Prisma.medical_recordsWhereInput = {};
    if (appointment_id) where.appointment_id = appointment_id;
    if (dentist_id) where.dentist_id = dentist_id;
    if (treatment_id) where.treatment_id = treatment_id;

    const [total, data] = await Promise.all([
      prisma.medical_records.count({ where }),
      prisma.medical_records.findMany({
        where,
        include,
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
    const record = await prisma.medical_records.findUnique({ where: { id }, include });
    if (!record) throw ApiError.notFound('Rekam medis tidak ditemukan');
    return record;
  },

  async create(input: CreateMedicalRecordInput) {
    const [appointment, treatment, dentist] = await Promise.all([
      prisma.appointments.findUnique({ where: { id: input.appointment_id } }),
      prisma.treatments.findUnique({ where: { id: input.treatment_id } }),
      prisma.dentists.findUnique({ where: { id: input.dentist_id } }),
    ]);
    if (!appointment) throw ApiError.notFound('Jadwal tidak ditemukan');
    if (!treatment) throw ApiError.notFound('Tindakan tidak ditemukan');
    if (!dentist) throw ApiError.notFound('Dokter tidak ditemukan');

    const data = {
      ...input,
      price: input.price ?? Number(treatment.price),
    };

    return prisma.medical_records.create({ data, include });
  },

  async update(id: string, input: Partial<CreateMedicalRecordInput>) {
    await medicalRecordService.getById(id);

    if (input.appointment_id) {
      const appointment = await prisma.appointments.findUnique({
        where: { id: input.appointment_id },
      });
      if (!appointment) throw ApiError.notFound('Jadwal tidak ditemukan');
    }
    if (input.treatment_id) {
      const treatment = await prisma.treatments.findUnique({ where: { id: input.treatment_id } });
      if (!treatment) throw ApiError.notFound('Tindakan tidak ditemukan');
    }
    if (input.dentist_id) {
      const dentist = await prisma.dentists.findUnique({ where: { id: input.dentist_id } });
      if (!dentist) throw ApiError.notFound('Dokter tidak ditemukan');
    }

    return prisma.medical_records.update({ where: { id }, data: input, include });
  },

  async remove(id: string) {
    await medicalRecordService.getById(id);
    await prisma.medical_records.delete({ where: { id } });
  },
};
