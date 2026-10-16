import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { parse } from '../lib/http';

export const dashboardRouter = Router();

// "Hoje" e "este mês" vêm do navegador, para respeitar o fuso do usuário
const querySchema = z.object({
  dayStart: z.coerce.date(),
  dayEnd: z.coerce.date(),
  monthFrom: z.coerce.date(), // yyyy-MM-dd (datas do financeiro são dias)
  monthTo: z.coerce.date(),
});

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

dashboardRouter.get('/', async (req, res) => {
  const { dayStart, dayEnd, monthFrom, monthTo } = parse(querySchema, req.query);
  const { userId, role } = req.auth!;
  const now = new Date();
  const weekEnd = new Date(now.getTime() + WEEK_MS);

  const pendingDeadline = { status: 'PENDING' as const, process: { status: 'ACTIVE' as const } };

  const [activeProcesses, weekDeadlines, deadlineHearingsToday, eventHearingsToday, upcomingDeadlines, upcomingEvents] =
    await prisma.$transaction([
      prisma.process.count({ where: { status: 'ACTIVE' } }),
      prisma.processDeadline.count({ where: { ...pendingDeadline, date: { gte: now, lte: weekEnd } } }),
      prisma.processDeadline.count({
        where: { ...pendingDeadline, type: 'HEARING', date: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.calendarEvent.count({
        where: { userId, category: 'HEARING', start: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.processDeadline.findMany({
        where: { ...pendingDeadline, date: { gte: now } },
        include: { process: { select: { id: true, number: true, client: { select: { name: true } } } } },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      prisma.calendarEvent.findMany({
        where: { userId, end: { gte: now } },
        orderBy: { start: 'asc' },
        take: 5,
      }),
    ]);

  // Faturamento só para quem tem acesso ao financeiro
  let monthlyIncome: number | null = null;
  if (role !== 'ASSISTANT') {
    const income = await prisma.financialRecord.aggregate({
      where: { type: 'INCOME', status: 'PAID', date: { gte: monthFrom, lte: monthTo } },
      _sum: { amount: true },
    });
    monthlyIncome = income._sum.amount?.toNumber() ?? 0;
  }

  res.json({
    activeProcesses,
    weekDeadlines,
    hearingsToday: deadlineHearingsToday + eventHearingsToday,
    monthlyIncome,
    upcomingDeadlines,
    upcomingEvents,
  });
});
