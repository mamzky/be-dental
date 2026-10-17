import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

type CreateDentistInput = {
  user_id?: string;
  full_name: string;
  specialization?: string;
  str_number?: string;
  phone?: string;
  email?: string;
  notes?: string;
  is_active?: boolean;
};

type ListParams = {
  page: number;
  limit: number;
  search?: string;
};

export const dentistService = {
  async list({ page, limit, search }: ListParams) {
    const where: Prisma.dentistsWhereInput = search
      ? {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { str_number: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.dentists.count({ where }),
      prisma.dentists.findMany({
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
    const dentist = await prisma.dentists.findUnique({ where: { id } });
    if (!dentist) throw ApiError.notFound('Dokter tidak ditemukan');
    return dentist;
  },

  async create(input: CreateDentistInput) {
    if (input.user_id) {
      const user = await prisma.users.findUnique({ where: { id: input.user_id } });
      if (!user) throw ApiError.notFound('User tidak ditemukan');
    }

    if (input.str_number) {
      const strExists = await prisma.dentists.findUnique({
        where: { str_number: input.str_number },
      });
      if (strExists) throw ApiError.conflict('str_number sudah dipakai');
    }

    return prisma.dentists.create({ data: input });
  },

  async update(id: string, input: Partial<CreateDentistInput>) {
    await dentistService.getById(id);

    if (input.user_id) {
      const user = await prisma.users.findUnique({ where: { id: input.user_id } });
      if (!user) throw ApiError.notFound('User tidak ditemukan');
    }

    if (input.str_number) {
      const strExists = await prisma.dentists.findFirst({
        where: { str_number: input.str_number, NOT: { id } },
      });
      if (strExists) throw ApiError.conflict('str_number sudah dipakai');
    }

    return prisma.dentists.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await dentistService.getById(id);
    await prisma.dentists.delete({ where: { id } });
  },
};
