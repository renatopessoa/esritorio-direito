import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';
import { config } from '../config';
import { HttpError } from '../lib/http';
import { prisma } from '../lib/prisma';

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthPayload;
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function readToken(req: Request): AuthPayload | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.slice(7), config.jwtSecret) as AuthPayload;
  } catch {
    return null;
  }
}

/** Exige um token válido de um usuário ainda ativo. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (!payload) throw new HttpError(401, 'Não autenticado');

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, active: true },
  });
  if (!user || !user.active) throw new HttpError(401, 'Usuário inválido ou inativo');

  req.auth = { userId: user.id, email: user.email, role: user.role };
  next();
}

/** Preenche req.auth se houver token válido, sem bloquear a requisição. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  req.auth = readToken(req) ?? undefined;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw new HttpError(403, 'Você não tem permissão para realizar esta ação');
    }
    next();
  };
}
