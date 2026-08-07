import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '../types';

interface AuthState {
  currentUser: Customer | null;
  isAdminAuthenticated: boolean;
  loginAsCustomer: (email: string) => boolean;
  registerCustomer: (name: string, email: string, phone: string) => void;
  logoutCustomer: () => void;
  loginAsAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateProfile: (updated: Partial<Customer>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAdminAuthenticated: true,

      loginAsCustomer: (email) => {
        const newUser: Customer = {
          id: `cust-${Date.now()}`,
          name: email.split('@')[0] || 'Customer',
          email,
          phone: '—',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          joinedDate: new Date().toISOString().split('T')[0],
          totalOrders: 0,
          totalSpent: 0,
          savedAddresses: []
        };
        set({ currentUser: newUser });
        return true;
      },

      registerCustomer: (name, email, phone) => {
        const newUser: Customer = {
          id: `cust-${Date.now()}`,
          name: name || 'Customer',
          email: email || '—',
          phone: phone || '—',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          joinedDate: new Date().toISOString().split('T')[0],
          totalOrders: 0,
          totalSpent: 0,
          savedAddresses: []
        };
        set({ currentUser: newUser });
      },

      logoutCustomer: () => set({ currentUser: null }),

      loginAsAdmin: (pass) => {
        set({ isAdminAuthenticated: true });
        return true;
      },

      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      updateProfile: (updated) => {
        const current = get().currentUser;
        if (current) {
          set({ currentUser: { ...current, ...updated } });
        }
      }
    }),
    {
      name: 'br-kitchen-auth-storage'
    }
  )
);
