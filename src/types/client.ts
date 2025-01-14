import { z } from 'zod';

export const clientDocumentSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  name: z.string(),
  url: z.string().url(),
  size: z.number(),
  type: z.string(),
  created_at: z.string().datetime(),
});

export type ClientDocument = z.infer<typeof clientDocumentSchema>;

export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  document_id: z.string().min(11, 'CPF/CNPJ inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 letras'),
    zipCode: z.string().length(8, 'CEP inválido'),
  }),
  notes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Client = z.infer<typeof clientSchema>;