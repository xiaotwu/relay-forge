import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'relayforge-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
}

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Only auto-switch if user hasn't manually set a preference
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
