import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { HttpError, param, parse } from '../lib/http';

export const calendarRouter = Router();

const eventSchema = z
  .object({
    title: z.string().min(3),
    start: z.coerce.date(),
    end: z.coerce.date(),
    description: z.string().optional(),
    location: z.string().optional(),
    category: z.enum(['MEETING', 'EVENT', 'TASK', 'HEARING', 'DEADLINE', 'OTHER']).default('OTHER'),
    recurrence: z
      .object({
        type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
        interval: z.number().optional(),
        until: z.string().datetime().optional(),
      })
      .optional(),
    participants: z.array(z.string()).default([]),
    reminders: z.array(z.object({ type: z.enum(['EMAIL', 'NOTIFICATION']), minutes: z.number() })).optional(),
    color: z.string().optional(),
  });

const rangeSchema = z.object({ from: z.coerce.date().optional(), to: z.coerce.date().optional() });

// Cada usuário vê e edita apenas a própria agenda
async function findOwnEvent(id: string, userId: string) {
  const event = await prisma.calendarEvent.findUnique({ where: { id } });
  if (!event || event.userId !== userId) throw new HttpError(404, 'Evento não encontrado');
  return event;
}

calendarRouter.get('/', async (req, res) => {
  const { from, to } = parse(rangeSchema, req.query);
  const events = await prisma.calendarEvent.findMany({
    where: {
      userId: req.auth!.userId,
      ...(from && { end: { gte: from } }),
      ...(to && { start: { lte: to } }),
    },
    orderBy: { start: 'asc' },
  });
  res.json(events);
});

calendarRouter.post('/', async (req, res) => {
  const data = parse(eventSchema, req.body);
  if (data.end < data.start) throw new HttpError(400, 'O término deve ser depois do início');

  const event = await prisma.calendarEvent.create({ data: { ...data, userId: req.auth!.userId } });
  res.status(201).json(event);
});

calendarRouter.put('/:id', async (req, res) => {
  const id = param(req, 'id');
  const current = await findOwnEvent(id, req.auth!.userId);
  const data = parse(eventSchema.partial(), req.body);
  if ((data.end ?? current.end) < (data.start ?? current.start)) {
    throw new HttpError(400, 'O término deve ser depois do início');
  }

  const event = await prisma.calendarEvent.update({ where: { id }, data });
  res.json(event);
});

calendarRouter.delete('/:id', async (req, res) => {
  const id = param(req, 'id');
  await findOwnEvent(id, req.auth!.userId);
  await prisma.calendarEvent.delete({ where: { id } });
  res.status(204).end();
});
