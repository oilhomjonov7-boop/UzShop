import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

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

      syncProfile: async () => {
        const currentUser = get().user;
        if (!currentUser?.email) return;

        try {
          const res = await fetch(`http://localhost:5001/users?email=${encodeURIComponent(currentUser.email)}`);
          if (res.ok) {
            const data = await res.json();
            const fresh = Array.isArray(data) && data.length > 0 ? data[0] : (data?.email ? data : null);
            if (fresh) {
              const { password: _, ...cleanUser } = fresh;
              set({ user: cleanUser, isAuthenticated: true });
              return cleanUser;
            }
          }
        } catch (err) {
          // Keep current state when offline
        }
      },

      hasRole: (allowedRoles) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        if (currentUser.role === 'Admin') return true;
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
