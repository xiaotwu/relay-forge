import { create } from 'zustand';

interface UIState {
  rightSidebarCollapsed: boolean;
  toggleRightSidebar: () => void;
  setRightSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  rightSidebarCollapsed: false,
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarCollapsed: !state.rightSidebarCollapsed })),
  setRightSidebarCollapsed: (collapsed: boolean) => set({ rightSidebarCollapsed: collapsed }),
}));
