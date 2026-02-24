"use client";

import { useState, useEffect, useCallback } from "react";
import type { Theme } from "@/types";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        // Read from localStorage on mount
        const stored = localStorage.getItem("theme") as Theme | null;
        const preferred = stored || "dark";
        setTheme(preferred);
        applyTheme(preferred);
    }, []);

    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        if (t === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
    };

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next: Theme = prev === "dark" ? "light" : "dark";
            localStorage.setItem("theme", next);
            applyTheme(next);
            return next;
        });
    }, []);

    return { theme, toggleTheme };
}
