"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

function applyTheme(t: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (t === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
    } else {
        root.classList.add("light");
        root.classList.remove("dark");
    }
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: "dark",
            toggleTheme: () => {
                const next: Theme = get().theme === "dark" ? "light" : "dark";
                applyTheme(next);
                set({ theme: next });
            },
            setTheme: (theme: Theme) => {
                applyTheme(theme);
                set({ theme });
            },
        }),
        {
            name: "theme-storage",
            onRehydrateStorage: () => (state) => {
                // Apply theme when store is rehydrated from localStorage
                if (state) applyTheme(state.theme);
            },
        }
    )
);
