import { z } from 'zod';

export const addressSchema = z.object({
  zipCode: z.string().min(8),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
});

export const userRoleSchema = z.enum(['ADMIN', 'LAWYER', 'ASSISTANT']);

export const userCreateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  role: userRoleSchema.default('ASSISTANT'),
  cpf: z.string().transform((v) => v.replace(/\D/g, '')).pipe(z.string().length(11, 'CPF inválido')),
  birthDate: z.coerce.date(),
  phone: z.string().min(10),
  landline: z.string().optional(),
  position: z.string().min(2),
  address: addressSchema.optional(),
});

export const userUpdateSchema = userCreateSchema.partial();

/** Campos de User que podem ser devolvidos pela API (nunca a senha). */
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  cpf: true,
  birthDate: true,
  phone: true,
  landline: true,
  address: true,
  position: true,
  avatarUrl: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;
