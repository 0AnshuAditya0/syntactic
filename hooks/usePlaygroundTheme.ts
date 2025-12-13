'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Wrapper around next-themes to provide specific playground theming logic if needed.
// For now, it mirrors the global theme but ensures we have a 'light' | 'dark' value.

export function usePlaygroundTheme() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const effectiveTheme = mounted ? (currentTheme === 'dark' ? 'dark' : 'light') : 'light';

    const toggleTheme = () => {
        setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
    };

    return {
        theme: effectiveTheme,
        toggleTheme,
        mounted
    };
}
