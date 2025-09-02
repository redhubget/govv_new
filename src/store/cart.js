// Global Cart Store using Zustand
import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((it) => it.id === item.id);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.id === item.id ? { ...it, qty: it.qty + 1 } : it
          ),
        };
      }
      return { items: [...state.items, { ...item, qty: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, qty) } : it
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
