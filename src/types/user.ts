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
  birthDate: z.string({
    required_error: 'Data de nascimento é obrigatória',
  }).refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'Usuário deve ter no mínimo 18 anos'),
  cpf: z.string()
    .min(11, 'CPF inválido')
    .max(11, 'CPF inválido')
    .refine((cpf) => {
      const numbers = cpf.replace(/\D/g, '');
      return numbers.length === 11;
    }, 'CPF deve conter 11 dígitos'),
  phone: z.string()
    .min(11, 'Telefone inválido')
    .refine((phone) => {
      const numbers = phone.replace(/\D/g, '');
      return numbers.length >= 10 && numbers.length <= 11;
    }, 'Telefone deve conter DDD + número'),
  landline: z.string().optional(),
  position: z.string().min(2, 'Cargo é obrigatório'),
  address: z
    .object({
      zipCode: z.string().length(8, 'CEP inválido'),
      street: z.string().min(3, 'Rua é obrigatória'),
      number: z.string().min(1, 'Número é obrigatório'),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, 'Bairro é obrigatório'),
      city: z.string().min(2, 'Cidade é obrigatória'),
      state: z.string().length(2, 'Estado deve ter 2 letras'),
    })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

export type UserFormData = z.infer<typeof userSchema>;

export const userRoles = {
  ADMIN: 'Administrador',
  LAWYER: 'Advogado',
  ASSISTANT: 'Assistente',
} as const;

export const positionsByRole = {
  ADMIN: ['Administrador do Sistema', 'Gerente'],
  LAWYER: ['Advogado(a) Sênior', 'Advogado(a) Pleno', 'Advogado(a) Júnior'],
  ASSISTANT: ['Assistente Jurídico', 'Estagiário(a)'],
} as const;