import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { HttpError, param, parse } from '../lib/http';
import { addressSchema } from '../lib/schemas';
import { requireRole } from '../middleware/auth';

export const clientsRouter = Router();

const clientSchema = z.object({
  name: z.string().min(3),
  documentId: z.string().transform((v) => v.replace(/\D/g, '')).pipe(
    z.string().refine((v) => v.length === 11 || v.length === 14, 'CPF/CNPJ inválido'),
  ),
  email: z.string().email(),
  phone: z.string().min(10),
  address: addressSchema,
  notes: z.string().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const withRelations = {
  documents: true,
  _count: { select: { processes: true, documents: true } },
} satisfies Prisma.ClientInclude;

clientsRouter.get('/', async (req, res) => {
  const { page, limit, search, sortBy, sortOrder } = parse(listQuerySchema, req.query);

  const where: Prisma.ClientWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { documentId: { contains: search.replace(/\D/g, '') || search } },
        ],
      }
    : {};

  const [total, data] = await prisma.$transaction([
    prisma.client.count({ where }),
    prisma.client.findMany({
      where,
      include: withRelations,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

clientsRouter.get('/statistics', async (_req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [total, thisMonth, lastMonth] = await prisma.$transaction([
    prisma.client.count(),
    prisma.client.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.client.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
  ]);
  res.json({ total, thisMonth, lastMonth });
});

clientsRouter.get('/:id', async (req, res) => {
  const client = await prisma.client.findUniqueOrThrow({ where: { id: param(req, 'id') }, include: withRelations });
  res.json(client);
});

clientsRouter.post('/', async (req, res) => {
  const client = await prisma.client.create({ data: parse(clientSchema, req.body) });
  res.status(201).json(client);
});

clientsRouter.put('/:id', async (req, res) => {
  const client = await prisma.client.update({
    where: { id: param(req, 'id') },
    data: parse(clientSchema.partial(), req.body),
  });
  res.json(client);
});

clientsRouter.delete('/:id', requireRole('ADMIN', 'LAWYER'), async (req, res) => {
  const id = param(req, 'id');
  const processes = await prisma.process.count({ where: { clientId: id } });
  if (processes > 0) {
    throw new HttpError(409, 'Este cliente possui processos vinculados e não pode ser excluído');
  }
  await prisma.client.delete({ where: { id } });
  res.status(204).end();
});
