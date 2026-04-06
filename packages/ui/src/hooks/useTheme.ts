import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'relayforge-theme';

function resolveSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored;
  }

  return 'system';
}

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const resolvedTheme = theme === 'system' ? resolveSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(resolvedTheme);
  root.setAttribute('data-theme', resolvedTheme);
  root.setAttribute('data-theme-mode', theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || stored === 'system') {
        setThemeState('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme === 'system') {
      localStorage.setItem(STORAGE_KEY, 'system');
    } else {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const resolvedTheme = theme === 'system' ? resolveSystemTheme() : theme;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const effectiveTheme = theme === 'system' ? resolveSystemTheme() : theme;

  return { theme, setTheme, toggleTheme, isDark: effectiveTheme === 'dark', effectiveTheme };
}
