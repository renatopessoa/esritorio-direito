import { z } from 'zod';

export const addressSchema = z.object({
  zipCode: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
});

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  documentId: z.string()
    .min(11, 'CPF/CNPJ inválido')
    .transform(val => val.replace(/\D/g, '')),
  email: z.string().email('Email inválido'),
  phone: z.string()
    .min(10, 'Telefone inválido')
    .transform(val => val.replace(/\D/g, '')),
  address: addressSchema,
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;