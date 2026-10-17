import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import type { AppointmentStatus } from '../validations/appointment.validation';

type CreateAppointmentInput = {
  patient_id: string;
  dentist_id: string;
  scheduled_at: Date;
  status?: AppointmentStatus;
  complaint?: string;
  notes?: string;
};

type ListParams = {
  page: number;
  limit: number;
  status?: AppointmentStatus;
  patient_id?: string;
  dentist_id?: string;
  from?: Date;
  to?: Date;
};

const include = {
  patients: { select: { id: true, patient_no: true, full_name: true } },
  dentists: { select: { id: true, full_name: true } },
} satisfies Prisma.appointmentsInclude;

export const appointmentService = {
  async list({ page, limit, status, patient_id, dentist_id, from, to }: ListParams) {
    const where: Prisma.appointmentsWhereInput = {};
    if (status) where.status = status;
    if (patient_id) where.patient_id = patient_id;
    if (dentist_id) where.dentist_id = dentist_id;
    if (from || to) {
      where.scheduled_at = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    const [total, data] = await Promise.all([
      prisma.appointments.count({ where }),
      prisma.appointments.findMany({
        where,
        include,
        orderBy: { scheduled_at: 'asc' },
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
    const appointment = await prisma.appointments.findUnique({ where: { id }, include });
    if (!appointment) throw ApiError.notFound('Jadwal tidak ditemukan');
    return appointment;
  },

  async create(input: CreateAppointmentInput) {
    const [patient, dentist] = await Promise.all([
      prisma.patients.findUnique({ where: { id: input.patient_id } }),
      prisma.dentists.findUnique({ where: { id: input.dentist_id } }),
    ]);
    if (!patient) throw ApiError.notFound('Pasien tidak ditemukan');
    if (!dentist) throw ApiError.notFound('Dokter tidak ditemukan');

    return prisma.appointments.create({ data: input, include });
  },

  async update(id: string, input: Partial<CreateAppointmentInput>) {
    await appointmentService.getById(id);

    if (input.patient_id) {
      const patient = await prisma.patients.findUnique({ where: { id: input.patient_id } });
      if (!patient) throw ApiError.notFound('Pasien tidak ditemukan');
    }
    if (input.dentist_id) {
      const dentist = await prisma.dentists.findUnique({ where: { id: input.dentist_id } });
      if (!dentist) throw ApiError.notFound('Dokter tidak ditemukan');
    }

    return prisma.appointments.update({ where: { id }, data: input, include });
  },

  async remove(id: string) {
    await appointmentService.getById(id);
    await prisma.appointments.delete({ where: { id } });
  },
};
