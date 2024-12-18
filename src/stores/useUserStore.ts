import { create } from 'zustand';
import type { User } from '../types/user';

interface UserStore {
  users: User[];
  getActiveUsers: () => User[];
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [
    {
      id: '1',
      name: 'Dra. Wivinay Melo',
      email: '',
      role: 'lawyer',
      active: true,
      registration: 'OAB/PE 51277',
      position: ''
    },
    {
      id: '2',
      name: 'Dra. Emilia Florentino',
      email: '',
      role: 'lawyer',
      active: true,
      registration: 'OAB/PE 41075',
      position: ''
    }
  ],
  getActiveUsers: () => get().users.filter(user => user.active),
  getUserById: (id) => get().users.find(user => user.id === id),
}));