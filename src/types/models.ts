// Model Types
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseModel {
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'staff' | 'client';
  phone?: string;
  address?: string;
  cases?: Case[];
}

export interface Case extends BaseModel {
  number: string;
  court: string;
  type: string;
  status: 'pending' | 'active' | 'closed' | 'archived';
  description?: string;
  dueDate?: Date;
  parties: Party[];
  assignedLawyer?: User;
  lawyerId?: string;
}

export interface Party extends BaseModel {
  name: string;
  type: 'plaintiff' | 'defendant';
  document: string;
  email: string;
  phone: string;
  address: string;
  cases?: Case[];
}

// Response Types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}