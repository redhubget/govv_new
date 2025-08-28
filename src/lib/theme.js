// src/lib/theme.js
const THEME_KEY = 'govv_theme'; // 'light' | 'dark' | 'system'

export function applyTheme(theme) {
  const root = document.documentElement;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const effective =
    theme === 'system' ? (mql.matches ? 'dark' : 'light') : theme;

  // Set attribute for your CSS variables
  root.setAttribute('data-theme', effective);

  // Toggle Tailwind's dark class (since tailwind.config.js has darkMode: ["class"])
  root.classList.toggle('dark', effective === 'dark');

  // Optional: update browser UI color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', effective === 'dark' ? '#0b0f14' : '#f6f8fb');
}

export function initThemeFromStorage() {
  const saved = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(saved);

  // Keep in sync with OS changes when on "system"
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    const current = localStorage.getItem(THEME_KEY) || 'system';
    if (current === 'system') applyTheme('system');
  };
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  else mql.addListener(onChange); // older Safari

  return () => {
    if (mql.removeEventListener) mql.removeEventListener('change', onChange);
    else mql.removeListener(onChange);
  };
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}
