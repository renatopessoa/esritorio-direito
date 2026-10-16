import type { ErrorRequestHandler, Request } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError, type ZodTypeAny, type output } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function parse<S extends ZodTypeAny>(schema: S, data: unknown): output<S> {
  return schema.parse(data);
}

export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string') throw new HttpError(400, `Parâmetro ${name} inválido`);
  return value;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      issues: err.issues,
    });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ message: `Já existe um registro com este valor (${String(err.meta?.target ?? '')})` });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Registro não encontrado' });
      return;
    }
    if (err.code === 'P2003') {
      res.status(409).json({ message: 'Registro relacionado não existe ou ainda está em uso' });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
};
