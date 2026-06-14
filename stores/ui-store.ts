import { createStore } from "zustand";
export type Theme = "light" | "dark";

export type UiState = {
  /** Desktop: whether the in-flow sidebar column is hidden. */
  sidebarCollapsed: boolean;
  /** Mobile (<md): whether the overlay nav drawer is open. */
  mobileNavOpen: boolean;
  theme: Theme;
};

export type UiActions = {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
  setTheme: (theme: Theme) => void;
};

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  theme: "dark",
};

export const createUiStore = (init: UiState = defaultUiState) => {
  return createStore<UiStore>()((set) => ({
    ...init,
    toggleSidebar() {
      set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }));
    },
    setSidebarCollapsed(collapsed) {
      set({ sidebarCollapsed: collapsed });
    },
    toggleMobileNav() {
      set((s) => ({ mobileNavOpen: !s.mobileNavOpen }));
    },
    closeMobileNav() {
      set({ mobileNavOpen: false });
    },
    setTheme(theme) {
      set({ theme });
    },
  }));
};
