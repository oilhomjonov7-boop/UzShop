import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useTranslation } from '../../utils/useTranslation';

export const ThemeToggle = ({ variant = 'navbar', className = '' }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { t } = useTranslation();

  const labelText = isDark
    ? t('nav.themeLight', 'Kunduzgi rejim')
    : t('nav.themeDark', 'Tungi rejim');

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-amber-300 border border-slate-700'
            : 'bg-slate-100 text-slate-700 border border-slate-200'
        } ${className}`}
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
          <span>{labelText}</span>
        </span>

        {/* Toggle Switch UI */}
        <div
          className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
            isDark ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 sm:px-3 sm:py-2 rounded-xl border transition-all duration-300 active:scale-95 group focus:outline-none flex items-center gap-1.5 cursor-pointer shadow-xs ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400 hover:text-amber-300'
          : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:text-slate-900'
      } ${className}`}
      title={labelText}
      aria-label={labelText}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 group-hover:text-indigo-600 transition-transform duration-300 -rotate-12 group-hover:rotate-0" />
        )}
      </div>

      <span className="hidden xl:inline text-xs font-bold">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
