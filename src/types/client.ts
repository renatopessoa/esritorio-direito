import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  documentId: z.string().min(11, 'CPF/CNPJ inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado inválido'),
    zipCode: z.string().length(8, 'CEP inválido'),
  }),
  notes: z.string().optional(),
  documents: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number(),
    uploadedAt: z.date(),
  })).optional(),
  history: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['CONTACT', 'MEETING', 'DOCUMENT', 'OTHER']),
    description: z.string(),
    date: z.date(),
    createdBy: z.string().uuid(),
  })).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Client = z.infer<typeof clientSchema>;