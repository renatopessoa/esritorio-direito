import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT';
  active: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
