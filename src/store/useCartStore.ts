import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, FoodItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (food: FoodItem, quantity?: number, selectedOptions?: string[], instructions?: string) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (food, quantity = 1, selectedOptions = [], instructions = '') => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.food.id === food.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            if (instructions) updatedItems[existingIndex].specialInstructions = instructions;
            return { items: updatedItems };
          }
          return {
            items: [
              ...state.items,
              { food, quantity, selectedOptions, specialInstructions: instructions }
            ]
          };
        });
      },

      removeItem: (foodId) => {
        set((state) => ({
          items: state.items.filter((item) => item.food.id !== foodId)
        }));
      },

      updateQuantity: (foodId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(foodId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.food.id === foodId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
      },

      getTax: () => {
        return get().getSubtotal() * 0.08; // 8% sales tax
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 50 ? 0 : 4.99; // Free delivery over $50
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getDeliveryFee();
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'br-kitchen-cart-storage'
    }
  )
);
