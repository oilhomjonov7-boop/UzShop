import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistIds: [],

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        if (exists) {
          set({ wishlistIds: current.filter(id => id !== productId) });
          return false;
        } else {
          set({ wishlistIds: [...current, productId] });
          return true;
        }
      },

      isWishlisted: (productId) => {
        return get().wishlistIds.includes(productId);
      },

      getWishlistCount: () => {
        return get().wishlistIds.length;
      },

      clearWishlist: () => {
        set({ wishlistIds: [] });
      }
    }),
    {
      name: 'uzshop-wishlist-storage'
    }
  )
);
