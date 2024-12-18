export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  documentId: string;
  createdAt: Date;
}

export interface Process {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  deadlines: Deadline[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Deadline {
  id: string;
  processId: string;
  title: string;
  date: Date;
  type: 'hearing' | 'filing' | 'meeting';
  completed: boolean;
}

export interface Document {
  id: string;
  processId: string;
  title: string;
  type: 'petition' | 'contract' | 'evidence';
  url: string;
  version: number;
  createdAt: Date;
}

export interface FinancialRecord {
  id: string;
  processId: string;
  type: 'fee' | 'expense';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
}