import { create } from "zustand";

interface UiState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
