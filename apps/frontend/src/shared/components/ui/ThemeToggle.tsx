"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import { Button } from "@/shared/components/ui/button";

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white hover:bg-white/10 transition-all dark:hover:bg-white/10 hover:bg-slate-200"
            title={theme === "dark" ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
        >
            {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" />
            ) : (
                <Moon className="w-[18px] h-[18px] text-slate-600" />
            )}
        </Button>
    );
}
