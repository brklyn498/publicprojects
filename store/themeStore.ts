import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newIsDark);
      }
      return { isDark: newIsDark };
    });
  },

  setTheme: (isDark: boolean) => {
    set({ isDark });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
    }
  },
}));
