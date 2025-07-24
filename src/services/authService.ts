import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import type { UserRole } from '@prisma/client'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  cpf: string
  birthDate: string
  phone: string
  landline?: string
  position: string
  address?: any
}

interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private readonly JWT_EXPIRES_IN = '7d'

  // Login
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const { email, password } = credentials

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        active: true,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    if (!user.active) {
      throw new Error('Usuário inativo')
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Senha inválida')
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )

    // Retornar dados sem senha
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    }
  }

  // Registro
  async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // Verificar se CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf: data.cpf },
    })

    if (existingCpf) {
      throw new Error('CPF já cadastrado')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        birthDate: new Date(data.birthDate),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    })

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )

    return { user, token }
  }

  // Verificar token
  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
      })

      if (!user || !user.active) {
        throw new Error('Usuário inválido')
      }

      return user
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  // Logout (invalidar token no frontend)
  async logout(): Promise<void> {
    // No caso de JWT, o logout é feito removendo o token do frontend
    // Aqui podemos implementar uma blacklist se necessário
  }

  // Atualizar perfil
  async updateProfile(userId: string, data: Partial<RegisterData>): Promise<AuthUser> {
    const updateData: any = { ...data }
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12)
    }
    
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    })

    return user
  }
}

export const authService = new AuthService()