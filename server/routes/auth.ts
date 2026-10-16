import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { HttpError, param, parse } from '../lib/http';
import { publicUserSelect, userCreateSchema, userUpdateSchema } from '../lib/schemas';
import { optionalAuth, requireAuth, signToken } from '../middleware/auth';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = parse(loginSchema, req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, 'E-mail ou senha inválidos');
  }

  const { password: _omit, ...publicUser } = user;
  res.json({
    user: publicUser,
    token: signToken({ userId: user.id, email: user.email, role: user.role }),
  });
});

/**
 * Cadastro público só é permitido enquanto não existe nenhum usuário:
 * o primeiro cadastro vira ADMIN. Depois disso, apenas um ADMIN autenticado
 * pode cadastrar novos usuários.
 */
authRouter.post('/register', optionalAuth, async (req, res) => {
  const data = parse(userCreateSchema, req.body);
  const isFirstUser = (await prisma.user.count()) === 0;

  if (!isFirstUser && req.auth?.role !== 'ADMIN') {
    throw new HttpError(403, 'Cadastro restrito. Peça a um administrador para criar seu acesso.');
  }

  const user = await prisma.user.create({
    data: {
      ...data,
      role: isFirstUser ? 'ADMIN' : data.role,
      password: await bcrypt.hash(data.password, 12),
    },
    select: publicUserSelect,
  });

  res.status(201).json({
    user,
    token: signToken({ userId: user.id, email: user.email, role: user.role }),
  });
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.auth!.userId },
    select: publicUserSelect,
  });
  res.json({ user });
});

authRouter.put('/profile/:id', requireAuth, async (req, res) => {
  const id = param(req, 'id');
  if (req.auth!.userId !== id && req.auth!.role !== 'ADMIN') {
    throw new HttpError(403, 'Você só pode alterar o seu próprio perfil');
  }

  const { role, password, ...data } = parse(userUpdateSchema, req.body);
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
      // Só um ADMIN pode mudar papéis
      ...(role && req.auth!.role === 'ADMIN' ? { role } : {}),
    },
    select: publicUserSelect,
  });
  res.json({ user });
});
