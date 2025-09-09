import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/auth';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT';
  cpf: string;
  birthDate: string;
  phone: string;
  landline?: string;
  position: string;
  address?: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export const createUser = async (userData: CreateUserData) => {
  // Verificar se usuário já existe
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: userData.email },
        { cpf: userData.cpf }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw new Error('Este email já está em uso');
    }
    if (existingUser.cpf === userData.cpf) {
      throw new Error('Este CPF já está cadastrado');
    }
  }

  // Hash da senha
  const hashedPassword = await hashPassword(userData.password);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      cpf: userData.cpf,
      birthDate: new Date(userData.birthDate),
      phone: userData.phone,
      landline: userData.landline,
      position: userData.position,
      address: userData.address,
      active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cpf: true,
      birthDate: true,
      phone: true,
      landline: true,
      position: true,
      address: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
