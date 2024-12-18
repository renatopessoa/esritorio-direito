export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'assistant';
  active: boolean;
  registration?: string;
  position: string;
}