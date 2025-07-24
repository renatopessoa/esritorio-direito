import { prisma } from '../lib/prisma'
import type { Client, ClientDocument } from '@prisma/client'

interface CreateClientData {
  name: string
  documentId: string
  email: string
  phone: string
  address: any
  notes?: string
}

interface UpdateClientData extends Partial<CreateClientData> {}

interface ClientWithDocuments extends Client {
  documents: ClientDocument[]
  _count: {
    processes: number
    documents: number
  }
}

class ClientService {
  // Listar clientes com paginação e busca
  async getClients({
    page = 1,
    limit = 20,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    const skip = (page - 1) * limit
    
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { documentId: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              processes: true,
              documents: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ])

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  // Buscar cliente por ID
  async getClientById(id: string): Promise<ClientWithDocuments | null> {
    return prisma.client.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            processes: true,
            documents: true,
          },
        },
      },
    })
  }

  // Criar cliente
  async createClient(data: CreateClientData): Promise<Client> {
    // Verificar se documento já existe
    const existingClient = await prisma.client.findFirst({
      where: { documentId: data.documentId },
    })

    if (existingClient) {
      throw new Error('Cliente com este documento já existe')
    }

    return prisma.client.create({
      data,
    })
  }

  // Atualizar cliente
  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    // Verificar se cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id },
    })

    if (!existingClient) {
      throw new Error('Cliente não encontrado')
    }

    // Se está atualizando documento, verificar duplicatas
    if (data.documentId && data.documentId !== existingClient.documentId) {
      const duplicateClient = await prisma.client.findFirst({
        where: {
          documentId: data.documentId,
          id: { not: id },
        },
      })

      if (duplicateClient) {
        throw new Error('Cliente com este documento já existe')
      }
    }

    return prisma.client.update({
      where: { id },
      data,
    })
  }

  // Deletar cliente
  async deleteClient(id: string): Promise<void> {
    // Verificar se cliente tem processos ativos
    const processCount = await prisma.process.count({
      where: { clientId: id },
    })

    if (processCount > 0) {
      throw new Error('Não é possível deletar cliente com processos ativos')
    }

    await prisma.client.delete({
      where: { id },
    })
  }

  // Upload de documento
  async uploadDocument(clientId: string, file: {
    name: string
    url: string
    size: number
    type: string
  }): Promise<ClientDocument> {
    return prisma.clientDocument.create({
      data: {
        clientId,
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type,
      },
    })
  }

  // Deletar documento
  async deleteDocument(documentId: string): Promise<void> {
    await prisma.clientDocument.delete({
      where: { id: documentId },
    })
  }

  // Estatísticas
  async getStats() {
    const [total, thisMonth, thisWeek] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    return {
      total,
      thisMonth,
      thisWeek,
    }
  }
}

export const clientService = new ClientService()