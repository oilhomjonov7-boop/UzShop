import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const LANGUAGES = [
  {
    code: 'uz',
    name: "O'zbekcha",
    nativeName: "O'zbek tili",
    shortName: 'UZ',
    flagCode: 'uz',
    emoji: '🇺🇿'
  },
  {
    code: 'ru',
    name: 'Русский',
    nativeName: 'Русский язык',
    shortName: 'RU',
    flagCode: 'ru',
    emoji: '🇷🇺'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US)',
    shortName: 'EN',
    flagCode: 'en',
    emoji: '🇬🇧'
  },
  {
    code: 'uz-cyr',
    name: 'Ўзбекча',
    nativeName: 'Ўзбек тили (Кирилл)',
    shortName: 'ЎЗ',
    flagCode: 'uz',
    emoji: '🇺🇿'
  }
];

export const useLanguageStore = create(
  persist(
    (set) => ({
      currentLanguage: 'uz',
      setLanguage: (code) => {
        set({ currentLanguage: code });
        try {
          document.documentElement.lang = code === 'uz-cyr' ? 'uz-Cyrl' : code;
        } catch (e) {
          // ignore
        }
      }
    }),
    {
      name: 'uzshop_selected_language'
    }
  )
);
