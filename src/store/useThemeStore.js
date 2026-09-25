import { create } from 'zustand';

const THEME_STORAGE_KEY = 'uzshop_theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {
    // LocalStorage might be restricted
  }
  return 'light';
};

export const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    if (body) {
      body.classList.add('dark');
      body.style.colorScheme = 'dark';
    }
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    if (body) {
      body.classList.remove('dark');
      body.style.colorScheme = 'light';
    }
  }
};

// Initialize immediately on file evaluation
const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  isDark: initialTheme === 'dark',
  toggleTheme: () => {
    const current = get().theme;
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {}
    applyThemeToDocument(nextTheme);
    set({ theme: nextTheme, isDark: nextTheme === 'dark' });
  },
  setTheme: (newTheme) => {
    const theme = newTheme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
    applyThemeToDocument(theme);
    set({ theme, isDark: theme === 'dark' });
  }
}));
