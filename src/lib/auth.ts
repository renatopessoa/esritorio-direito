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

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// Utilitários para JWT no frontend (apenas leitura)
export const decodeJWT = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem('token');
};
