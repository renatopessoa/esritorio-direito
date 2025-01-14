import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['ADMIN', 'LAWYER', 'ASSISTANT'], {
    required_error: 'Função é obrigatória',
  }),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
    ),
  confirmPassword: z.string(),
  cpf: z.string().min(11, 'CPF inválido').max(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().optional(),
  landline: z.string().optional(),
  address: z.object({
    zipCode: z.string().length(8, 'CEP inválido'),
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 letras'),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});