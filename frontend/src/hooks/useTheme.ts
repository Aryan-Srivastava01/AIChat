import { create } from "zustand";

interface ThemeStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme:
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
      : "dark",
  setTheme: (theme) => set({ theme }),
}));
