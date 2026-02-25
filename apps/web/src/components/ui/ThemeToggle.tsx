"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all dark:hover:bg-white/10 light:hover:bg-slate-200"
            title={theme === "dark" ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
        >
            {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" />
            ) : (
                <Moon className="w-[18px] h-[18px] text-slate-600" />
            )}
        </button>
    );
}
