import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/entities/product';
import type { CartItem } from './types';

interface CartState {
  items: CartItem[];
}

interface CartActions {
  addItem: (product: Product) => { success: boolean; message?: string };
  removeItem: (productId: number) => { success: boolean; message?: string };
  updateQuantity: (productId: number, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      addItem: (product) => {
        if (product.stock === 0) {
          return { success: false, message: `${product.name} нет в наличии.` };
        }
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);
        let updatedItems: CartItem[];
        if (existingItem) {
          if (existingItem.quantity >= product.stock!) {
            return { success: false, message: `Больше нет в наличии ${product.name}.` };
          }
          updatedItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ items: updatedItems });
          return { success: true, message: `${product.name} (+1)` };
        } else {
          updatedItems = [...items, { ...product, quantity: 1 }];
          set({ items: updatedItems });
          return { success: true, message: `${product.name} добавлен в корзину` };
        }
      },
      removeItem: (productId) => {
        const itemToRemove = get().items.find((item) => item.id === productId);
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
        if (itemToRemove) {
          return { success: true, message: `${itemToRemove.name} удален из корзины` };
        }
        return { success: false, message: 'Товар не найден в корзине' };
      },
      updateQuantity: (productId, quantity) => {
        const itemToUpdate = get().items.find((item) => item.id === productId);
        if (!itemToUpdate) {
          return { success: false, message: 'Товар не найден в корзине' };
        }
        if (quantity < 1) {
          const result = get().removeItem(productId);
          return result;
        }
        if (itemToUpdate.stock! < quantity) {
          set({ items: get().items.map(item => item.id === productId ? { ...item, quantity: itemToUpdate.stock! } : item) });
          return { success: false, message: `Доступно только ${itemToUpdate.stock} шт. товара ${itemToUpdate.name}` };
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
        return { success: true };
      },
      clearCart: () => set({ ...initialState }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);