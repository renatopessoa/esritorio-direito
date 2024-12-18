import { z } from 'zod';

export const processSchema = z.object({
  id: z.string().uuid().optional(),
  number: z.string().min(1, 'Número do processo é obrigatório'),
  clientId: z.string().uuid('Cliente é obrigatório'),
  responsibleId: z.string().uuid('Responsável é obrigatório'),
  type: z.enum(['CIVIL', 'CRIMINAL', 'LABOR', 'TAX', 'OTHER']),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  description: z.string().optional(),
  court: z.object({
    name: z.string().min(1, 'Vara é obrigatória'),
    district: z.string().min(1, 'Comarca é obrigatória'),
  }),
  value: z.number().min(0, 'Valor da causa inválido'),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'SUSPENDED']),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  deadlines: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    type: z.enum(['HEARING', 'PETITION', 'MEETING', 'OTHER']),
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELED']),
  })),
  documents: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    type: z.string(),
    url: z.string(),
    version: z.number(),
    uploadedAt: z.date(),
  })),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Process = z.infer<typeof processSchema>;