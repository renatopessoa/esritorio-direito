import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  documentId: z.string().min(11, 'CPF/CNPJ inválido'),
  address: z.string().min(10, 'Endereço deve ter no mínimo 10 caracteres'),
});

export const processSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  clientId: z.string().uuid('Cliente inválido'),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['active', 'closed', 'pending']),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type ProcessFormData = z.infer<typeof processSchema>;