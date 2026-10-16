import { z } from 'zod';

export type FinancialType = 'INCOME' | 'EXPENSE';
export type FinancialCategory = 'FEE' | 'COURT_COST' | 'TRAVEL' | 'OTHER';
export type FinancialStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'OTHER';

/** Lançamento como devolvido pela API (GET /financial). */
export interface FinancialRecord {
  id: string;
  processId: string | null;
  clientId: string | null;
  userId: string;
  type: FinancialType;
  category: FinancialCategory;
  description: string;
  amount: number;
  date: string;
  dueDate: string | null;
  status: FinancialStatus;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client?: { id: string; name: string } | null;
  process?: { id: string; number: string } | null;
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
  receivable: number;
  payable: number;
}

export const categoryLabels: Record<FinancialCategory, string> = {
  FEE: 'Honorários',
  COURT_COST: 'Custas Processuais',
  TRAVEL: 'Despesas de Viagem',
  OTHER: 'Outros',
};

export const statusLabels: Record<FinancialStatus, string> = {
  PAID: 'Pago',
  PENDING: 'Pendente',
  OVERDUE: 'Vencido',
  CANCELED: 'Cancelado',
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  BANK_TRANSFER: 'Transferência / PIX',
  OTHER: 'Outro',
};

// <select> vazio chega como "" — tratamos como "não informado"
const optionalUuid = z.preprocess((v) => (v === '' ? undefined : v), z.string().uuid().optional());

export const financialFormSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['FEE', 'COURT_COST', 'TRAVEL', 'OTHER']),
  description: z.string().trim().min(3, 'Descrição é obrigatória'),
  amount: z.number({ invalid_type_error: 'Informe o valor' }).positive('O valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  dueDate: z.string().optional(),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELED']),
  paymentMethod: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER']).optional(),
  ),
  clientId: optionalUuid,
  processId: optionalUuid,
  notes: z.string().optional(),
});

export type FinancialFormData = z.infer<typeof financialFormSchema>;
