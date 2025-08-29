import { useEffect, useState, createContext, useContext } from 'react';

const ThemeCtx = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
  // Default to light if nothing stored
  const [theme, setTheme] = useState(() => localStorage.getItem('govv_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('govv_theme', theme);
    // map our value to a data attribute that CSS reads
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');

    // keep the browser UI color in sync (optional but nice)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="btn-outline"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}


