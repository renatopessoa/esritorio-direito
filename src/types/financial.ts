import { z } from 'zod';

export const financialRecordSchema = z.object({
  id: z.string().uuid().optional(),
  processId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['FEE', 'COURT_COST', 'TRAVEL', 'OTHER']),
  description: z.string().min(3, 'Descrição é obrigatória'),
  amount: z.number().min(0, 'Valor inválido'),
  date: z.date(),
  dueDate: z.date().optional(),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELED']),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER']).optional(),
  attachments: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type FinancialRecord = z.infer<typeof financialRecordSchema>;