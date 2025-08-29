import { useEffect, useState, createContext, useContext } from 'react';

const ThemeCtx = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // default to light if nothing stored
    return localStorage.getItem('govv_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('govv_theme', theme);
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    // (optional) change PWA theme color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button className="btn-outline" onClick={() => setTheme(next)}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

