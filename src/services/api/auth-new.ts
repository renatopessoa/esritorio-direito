import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../lib/auth';
import type { RegisterData, LoginCredentials, AuthUser } from '../../lib/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        active: true,
      },
    });

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    if (!user.active) {
      throw new Error('Conta desativada. Entre em contato com o administrador.');
    }

    // Verificar senha
    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }

    // Gerar token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      } as AuthUser,
      token,
    };
  },

  register: async (registerData: RegisterData) => {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: registerData.email },
          { cpf: registerData.cpf }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === registerData.email) {
        throw new Error('Este email já está em uso');
      }
      if (existingUser.cpf === registerData.cpf) {
        throw new Error('Este CPF já está cadastrado');
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(registerData.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: registerData.name,
        email: registerData.email,
        password: hashedPassword,
        role: registerData.role,
        cpf: registerData.cpf,
        birthDate: new Date(registerData.birthDate),
        phone: registerData.phone,
        landline: registerData.landline,
        position: registerData.position,
        address: registerData.address,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    // Gerar token
    const token = generateToken(user.id);

    return {
      user: user as AuthUser,
      token,
    };
  },

  verifyToken: async (token: string): Promise<AuthUser> => {
    try {
      const { userId } = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.active) {
        throw new Error('Conta desativada');
      }

      return user as AuthUser;
    } catch {
      throw new Error('Token inválido');
    }
  },

  updateProfile: async (userId: string, updateData: Partial<RegisterData>) => {
    // Preparar dados para atualização
    const updateFields: Record<string, unknown> = {};

    // Copiar campos básicos
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.role) updateFields.role = updateData.role;
    if (updateData.cpf) updateFields.cpf = updateData.cpf;
    if (updateData.phone) updateFields.phone = updateData.phone;
    if (updateData.landline) updateFields.landline = updateData.landline;
    if (updateData.position) updateFields.position = updateData.position;
    if (updateData.address) updateFields.address = updateData.address;

    // Se tem senha, fazer hash
    if (updateData.password) {
      updateFields.password = await hashPassword(updateData.password);
    }

    // Converter birthDate se fornecido
    if (updateData.birthDate) {
      updateFields.birthDate = new Date(updateData.birthDate);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    return user as AuthUser;
  },

  logout: async () => {
    // Como estamos usando JWT stateless, o logout é feito no frontend
    // removendo o token do localStorage
    return { message: 'Logout realizado com sucesso' };
  },
};
