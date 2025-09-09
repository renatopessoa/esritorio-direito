import { prisma } from '../../lib/prisma';
import type { Client } from '../../types/client';

export interface ClientData {
  name: string;
  document_id: string;
  email: string;
  phone: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  notes?: string;
}

export const createClient = async (clientData: ClientData): Promise<Client> => {
  const client = await prisma.client.create({
    data: {
      name: clientData.name,
      documentId: clientData.document_id,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      notes: clientData.notes,
    },
  });

  return {
    id: client.id,
    name: client.name,
    document_id: client.documentId,
    email: client.email,
    phone: client.phone,
    address: client.address as any,
    notes: client.notes || undefined,
    created_at: client.createdAt.toISOString(),
    updated_at: client.updatedAt.toISOString(),
  };
};

export const updateClient = async (id: string, clientData: Partial<ClientData>): Promise<Client> => {
  const client = await prisma.client.update({
    where: { id },
    data: {
      name: clientData.name,
      documentId: clientData.document_id,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      notes: clientData.notes,
    },
  });

  return {
    id: client.id,
    name: client.name,
    document_id: client.documentId,
    email: client.email,
    phone: client.phone,
    address: client.address as any,
    notes: client.notes || undefined,
    created_at: client.createdAt.toISOString(),
    updated_at: client.updatedAt.toISOString(),
  };
};

export const deleteClient = async (id: string): Promise<void> => {
  await prisma.client.delete({
    where: { id },
  });
};

export const listClients = async (): Promise<Client[]> => {
  const clients = await prisma.client.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return clients.map(client => ({
    id: client.id,
    name: client.name,
    document_id: client.documentId,
    email: client.email,
    phone: client.phone,
    address: client.address as any,
    notes: client.notes || undefined,
    created_at: client.createdAt.toISOString(),
    updated_at: client.updatedAt.toISOString(),
  }));
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) return null;

  return {
    id: client.id,
    name: client.name,
    document_id: client.documentId,
    email: client.email,
    phone: client.phone,
    address: client.address as any,
    notes: client.notes || undefined,
    created_at: client.createdAt.toISOString(),
    updated_at: client.updatedAt.toISOString(),
  };
};