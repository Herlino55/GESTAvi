import { create } from 'zustand';
import { User } from '../types/user';
import { SEED_USERS } from '../data/seed.user';

interface AuthState {
  users: User[];
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (userId: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  users: SEED_USERS,
  currentUser: null,

  login: (email: string) => {
    const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: Date.now()
    };
    set(state => ({ users: [...state.users, newUser] }));
  },

  deleteUser: (userId: number) => {
    set(state => ({
      users: state.users.filter(u => u.id !== userId)
    }));
  }
}));