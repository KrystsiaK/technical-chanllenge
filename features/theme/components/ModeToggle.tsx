"use client";

import { Button } from "@/components/ui/button";
import { Moon, MoonIcon, Sun, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export const ModeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const currentThem = resolvedTheme || theme;

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setTheme(currentThem === 'dark' ? 'light' : 'dark')}
        >
            {currentThem === 'dark' ? <Sun className="size-5" /> : <Moon className="size=5" />}
        </Button>
    )
}