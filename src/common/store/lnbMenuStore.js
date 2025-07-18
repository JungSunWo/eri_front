import { create } from 'zustand';

export const useLnbMenuStore = create((set) => ({
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }),
}));
