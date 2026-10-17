import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

type CreateTreatmentInput = {
  code: string;
  name: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
  is_bpjs_enable?: boolean;
};

type ListParams = {
  page: number;
  limit: number;
  search?: string;
};

export const treatmentService = {
  async list({ page, limit, search }: ListParams) {
    const where: Prisma.treatmentsWhereInput = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.treatments.count({ where }),
      prisma.treatments.findMany({
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
    const treatment = await prisma.treatments.findUnique({ where: { id } });
    if (!treatment) throw ApiError.notFound('Tindakan tidak ditemukan');
    return treatment;
  },

  async create(input: CreateTreatmentInput) {
    const codeExists = await prisma.treatments.findUnique({ where: { code: input.code } });
    if (codeExists) throw ApiError.conflict('code sudah dipakai');

    return prisma.treatments.create({ data: input });
  },

  async update(id: string, input: Partial<CreateTreatmentInput>) {
    await treatmentService.getById(id);

    if (input.code) {
      const codeExists = await prisma.treatments.findFirst({
        where: { code: input.code, NOT: { id } },
      });
      if (codeExists) throw ApiError.conflict('code sudah dipakai');
    }

    return prisma.treatments.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await treatmentService.getById(id);
    await prisma.treatments.delete({ where: { id } });
  },
};
