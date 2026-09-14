import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        id: 4,
        email: "ali@uzshop.uz",
        role: "User",
        name: "Ali Valiyev",
        phone: "+998991234567"
      },
      token: "mock-jwt-token-user-4",
      isAuthenticated: true,

      login: (userData, token) => {
        set({
          user: userData,
          token: token || `mock-jwt-token-${userData.id}-${Date.now()}`,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedFields) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: { ...currentUser, ...updatedFields }
        });
      },

      hasRole: (allowedRoles) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        if (Array.isArray(allowedRoles)) {
          return allowedRoles.includes(currentUser.role);
        }
        return currentUser.role === allowedRoles;
      }
    }),
    {
      name: 'uzshop-auth-storage',
    }
  )
);
