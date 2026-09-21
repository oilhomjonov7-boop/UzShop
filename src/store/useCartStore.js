import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return false;
        
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

        if (existingIndex > -1) {
          const existingItem = currentItems[existingIndex];
          const newQty = Math.min(existingItem.quantity + quantity, product.stock);
          
          const updatedItems = [...currentItems];
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQty
          };
          set({ items: updatedItems, isCartOpen: true });
        } else {
          const qty = Math.min(quantity, product.stock);
          set({
            items: [...currentItems, { product, quantity: qty }],
            isCartOpen: true
          });
        }
        return true;
      },

      updateQuantity: (productId, quantity) => {
        const currentItems = get().items;
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updated = currentItems.map(item => {
          if (item.product.id === productId) {
            const maxAllowed = item.product.stock || 99;
            return {
              ...item,
              quantity: Math.min(quantity, maxAllowed)
            };
          }
          return item;
        });

        set({ items: updated });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const hasDiscount = item.product.discountPrice && item.product.discountPrice < item.product.price;
          const price = hasDiscount ? item.product.discountPrice : item.product.price;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'uzshop-cart-storage',
    }
  )
);
