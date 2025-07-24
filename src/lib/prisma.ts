import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Função para conectar ao banco
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado ao PostgreSQL via Prisma')
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error)
    throw error
  }
}

// Função para desconectar
export async function disconnectDB() {
  await prisma.$disconnect()
}