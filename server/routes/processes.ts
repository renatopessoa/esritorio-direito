import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { param, parse } from '../lib/http';
import { requireRole } from '../middleware/auth';

export const processesRouter = Router();
export const deadlinesRouter = Router();

const processSchema = z.object({
  number: z.string().min(1),
  clientId: z.string().uuid(),
  responsibleId: z.string().uuid(),
  type: z.enum(['CIVIL', 'CRIMINAL', 'LABOR', 'TAX', 'OTHER']),
  subject: z.string().min(3),
  description: z.string().optional(),
  court: z.object({ name: z.string().min(1), district: z.string().min(1) }),
  value: z.coerce.number().min(0),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'SUSPENDED']).default('ACTIVE'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
});

const deadlineSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  type: z.enum(['HEARING', 'PETITION', 'MEETING', 'OTHER']),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELED']).default('PENDING'),
});

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'SUSPENDED']).optional(),
  clientId: z.string().uuid().optional(),
  responsibleId: z.string().uuid().optional(),
});

const withRelations = {
  client: { select: { id: true, name: true } },
  responsible: { select: { id: true, name: true } },
  deadlines: { orderBy: { date: 'asc' } },
  documents: true,
} satisfies Prisma.ProcessInclude;

// Decimal -> number para o frontend (que trata `value` como number)
function serialize<T extends { value: Prisma.Decimal }>(process: T) {
  return { ...process, value: process.value.toNumber() };
}

processesRouter.get('/', async (req, res) => {
  const { search, ...filters } = parse(listQuerySchema, req.query);
  const processes = await prisma.process.findMany({
    where: {
      ...filters,
      ...(search && {
        OR: [
          { number: { contains: search } },
          { subject: { contains: search, mode: 'insensitive' } },
          { client: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    },
    include: withRelations,
    orderBy: { updatedAt: 'desc' },
  });
  res.json(processes.map(serialize));
});

processesRouter.get('/:id', async (req, res) => {
  const process = await prisma.process.findUniqueOrThrow({ where: { id: param(req, 'id') }, include: withRelations });
  res.json(serialize(process));
});

processesRouter.post('/', async (req, res) => {
  const process = await prisma.process.create({ data: parse(processSchema, req.body), include: withRelations });
  res.status(201).json(serialize(process));
});

processesRouter.put('/:id', async (req, res) => {
  const process = await prisma.process.update({
    where: { id: param(req, 'id') },
    data: parse(processSchema.partial(), req.body),
    include: withRelations,
  });
  res.json(serialize(process));
});

processesRouter.delete('/:id', requireRole('ADMIN', 'LAWYER'), async (req, res) => {
  const id = param(req, 'id');
  // Lançamentos financeiros ficam, apenas desvinculados do processo
  await prisma.$transaction([
    prisma.financialRecord.updateMany({ where: { processId: id }, data: { processId: null } }),
    prisma.process.delete({ where: { id } }),
  ]);
  res.status(204).end();
});

processesRouter.post('/:id/deadlines', async (req, res) => {
  const deadline = await prisma.processDeadline.create({
    data: { ...parse(deadlineSchema, req.body), processId: param(req, 'id') },
  });
  res.status(201).json(deadline);
});

// Prazos dos próximos N dias, de todos os processos ativos (para o dashboard)
deadlinesRouter.get('/upcoming', async (req, res) => {
  const { days } = parse(z.object({ days: z.coerce.number().int().min(1).max(365).default(7) }), req.query);
  const now = new Date();
  const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const deadlines = await prisma.processDeadline.findMany({
    where: { status: 'PENDING', date: { gte: now, lte: until }, process: { status: 'ACTIVE' } },
    include: { process: { select: { id: true, number: true, subject: true } } },
    orderBy: { date: 'asc' },
  });
  res.json(deadlines);
});

deadlinesRouter.put('/:id', async (req, res) => {
  const deadline = await prisma.processDeadline.update({
    where: { id: param(req, 'id') },
    data: parse(deadlineSchema.partial(), req.body),
  });
  res.json(deadline);
});

deadlinesRouter.delete('/:id', async (req, res) => {
  await prisma.processDeadline.delete({ where: { id: param(req, 'id') } });
  res.status(204).end();
});
