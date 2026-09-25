import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore, LANGUAGES } from '../../store/useLanguageStore';
import { useTranslation } from '../../utils/useTranslation';
import { ChevronDown, Check } from 'lucide-react';

export const FlagIcon = ({ code, className = "w-5 h-3.5 rounded-xs object-cover shadow-2xs" }) => {
  if (code === 'uz' || code === 'uz-cyr') {
    return (
      <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-slate-200/80 shadow-2xs flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 500 250" className="w-full h-full">
          <rect width="500" height="80" fill="#0099B5" />
          <rect y="80" width="500" height="5" fill="#CE1126" />
          <rect y="85" width="500" height="80" fill="#FFFFFF" />
          <rect y="165" width="500" height="5" fill="#CE1126" />
          <rect y="170" width="500" height="80" fill="#1EB53A" />
          {/* Crescent */}
          <circle cx="50" cy="40" r="28" fill="#FFFFFF" />
          <circle cx="62" cy="40" r="24" fill="#0099B5" />
          {/* Stars in 3 rows: 3, 4, 5 */}
          <circle cx="100" cy="22" r="3.5" fill="#FFFFFF" />
          <circle cx="118" cy="22" r="3.5" fill="#FFFFFF" />
          <circle cx="136" cy="22" r="3.5" fill="#FFFFFF" />
          <circle cx="100" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="118" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="136" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="100" cy="58" r="3.5" fill="#FFFFFF" />
          <circle cx="118" cy="58" r="3.5" fill="#FFFFFF" />
          <circle cx="136" cy="58" r="3.5" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (code === 'ru') {
    return (
      <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-slate-200/80 shadow-2xs flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 450 300" className="w-full h-full">
          <rect width="450" height="100" fill="#FFFFFF" />
          <rect y="100" width="450" height="100" fill="#0039A6" />
          <rect y="200" width="450" height="100" fill="#D52B1E" />
        </svg>
      </span>
    );
  }

  if (code === 'en') {
    return (
      <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-slate-200/80 shadow-2xs flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
          </clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      </span>
    );
  }

  return <span>🌐</span>;
};

export const LanguageSelector = ({ compact = false, showLabel = true }) => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs transition-all duration-200 active:scale-95 group focus:outline-none cursor-pointer ${
          isOpen ? 'ring-2 ring-emerald-500/20 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/40' : ''
        }`}
        title={t('nav.selectLanguage', 'Tilni tanlash')}
      >
        <FlagIcon code={activeLang.flagCode} className="w-5 h-3.5 shadow-xs" />
        
        {showLabel && (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white hidden md:inline">
            {compact ? activeLang.shortName : activeLang.name}
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800 p-1.5 z-50 animate-fade-in">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
            <span>{t('nav.selectLanguage', 'Tilni tanlang')}</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold lowercase">{t('nav.langLabel', 'til / язык')}</span>
          </div>

          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer group text-left ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FlagIcon code={lang.flagCode} className="w-5 h-3.5 shadow-2xs" />
                    <div>
                      <span className="block leading-tight">{lang.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 block group-hover:text-slate-500 dark:group-hover:text-slate-400">
                        {lang.nativeName}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
