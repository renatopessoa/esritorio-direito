import { create } from 'zustand';
import type { User } from '../types/user';
import { userRoles } from '../types/user';

interface UserStore {
  users: User[];
  getActiveUsers: () => User[];
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [
    {
      id: '',
      name: '',
      email: '',
      role: '',
      active: true,
      registration: '',
      position: ''
    },
    {
      id: '2',
      name: '',
      email: '',
      role: '',
      active: true,
      registration: '',
      position: ''
    }
  ],
  getActiveUsers: () => get().users.filter(user => user.active),
  getUserById: (id) => get().users.find(user => user.id === id),
}));