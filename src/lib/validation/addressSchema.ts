import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zipCode: z.string().length(8, 'CEP deve ter 8 dígitos'),
});

export type AddressData = z.infer<typeof addressSchema>;