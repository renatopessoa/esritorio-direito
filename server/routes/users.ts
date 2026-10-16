import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { HttpError, param, parse } from '../lib/http';
import { publicUserSelect, userCreateSchema, userUpdateSchema } from '../lib/schemas';
import { requireRole } from '../middleware/auth';

export const usersRouter = Router();

// Qualquer usuário autenticado pode listar (ex.: escolher responsável de um processo)
usersRouter.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({ select: publicUserSelect, orderBy: { name: 'asc' } });
  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: param(req, 'id') }, select: publicUserSelect });
  res.json(user);
});

usersRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  const data = parse(userCreateSchema, req.body);
  const user = await prisma.user.create({
    data: { ...data, password: await bcrypt.hash(data.password, 12) },
    select: publicUserSelect,
  });
  res.status(201).json(user);
});

usersRouter.put('/:id', requireRole('ADMIN'), async (req, res) => {
  const { password, ...data } = parse(userUpdateSchema, req.body);
  const user = await prisma.user.update({
    where: { id: param(req, 'id') },
    data: { ...data, ...(password ? { password: await bcrypt.hash(password, 12) } : {}) },
    select: publicUserSelect,
  });
  res.json(user);
});

usersRouter.patch('/:id/status', requireRole('ADMIN'), async (req, res) => {
  const id = param(req, 'id');
  const { active } = parse(z.object({ active: z.boolean() }), req.body);
  if (id === req.auth!.userId && !active) throw new HttpError(400, 'Você não pode desativar a si mesmo');

  const user = await prisma.user.update({ where: { id }, data: { active }, select: publicUserSelect });
  res.json(user);
});

usersRouter.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = param(req, 'id');
  if (id === req.auth!.userId) throw new HttpError(400, 'Você não pode excluir a si mesmo');

  await prisma.user.delete({ where: { id } });
  res.status(204).end();
});
