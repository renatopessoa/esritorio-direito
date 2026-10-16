import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { param, parse } from '../lib/http';
import { requireRole } from '../middleware/auth';

export const financialRouter = Router();

// Financeiro do escritório: apenas ADMIN e advogados
financialRouter.use(requireRole('ADMIN', 'LAWYER'));

const recordSchema = z.object({
  processId: z.string().uuid().nullish(),
  clientId: z.string().uuid().nullish(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['FEE', 'COURT_COST', 'TRAVEL', 'OTHER']),
  description: z.string().min(3),
  amount: z.coerce.number().positive(),
  date: z.coerce.date(),
  dueDate: z.coerce.date().nullish(),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELED']).default('PENDING'),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER']).nullish(),
  notes: z.string().optional(),
});

const listQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELED']).optional(),
  clientId: z.string().uuid().optional(),
  processId: z.string().uuid().optional(),
});

function buildWhere(query: z.infer<typeof listQuerySchema>): Prisma.FinancialRecordWhereInput {
  const { from, to, ...filters } = query;
  return {
    ...filters,
    ...((from || to) && { date: { ...(from && { gte: from }), ...(to && { lte: to }) } }),
  };
}

function serialize<T extends { amount: Prisma.Decimal }>(record: T) {
  return { ...record, amount: record.amount.toNumber() };
}

financialRouter.get('/', async (req, res) => {
  const records = await prisma.financialRecord.findMany({
    where: buildWhere(parse(listQuerySchema, req.query)),
    include: {
      client: { select: { id: true, name: true } },
      process: { select: { id: true, number: true } },
    },
    orderBy: { date: 'desc' },
  });
  res.json(records.map(serialize));
});

financialRouter.get('/summary', async (req, res) => {
  const where = buildWhere(parse(listQuerySchema, req.query));
  const groups = await prisma.financialRecord.groupBy({
    by: ['type', 'status'],
    where: { ...where, status: { not: 'CANCELED' } },
    _sum: { amount: true },
  });

  const sum = (type: 'INCOME' | 'EXPENSE', status?: string) =>
    groups
      .filter((g) => g.type === type && (!status || g.status === status))
      .reduce((acc, g) => acc + (g._sum.amount?.toNumber() ?? 0), 0);

  res.json({
    income: sum('INCOME', 'PAID'),
    expenses: sum('EXPENSE', 'PAID'),
    balance: sum('INCOME', 'PAID') - sum('EXPENSE', 'PAID'),
    receivable: sum('INCOME', 'PENDING') + sum('INCOME', 'OVERDUE'),
    payable: sum('EXPENSE', 'PENDING') + sum('EXPENSE', 'OVERDUE'),
  });
});

financialRouter.post('/', async (req, res) => {
  const record = await prisma.financialRecord.create({
    data: { ...parse(recordSchema, req.body), userId: req.auth!.userId },
  });
  res.status(201).json(serialize(record));
});

financialRouter.put('/:id', async (req, res) => {
  const record = await prisma.financialRecord.update({
    where: { id: param(req, 'id') },
    data: parse(recordSchema.partial(), req.body),
  });
  res.json(serialize(record));
});

financialRouter.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  await prisma.financialRecord.delete({ where: { id: param(req, 'id') } });
  res.status(204).end();
});
