import { useCallback, useMemo } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { TRANSLATIONS, CATEGORY_TRANSLATIONS, CITIES_TRANSLATIONS } from './translations';

export const useTranslation = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();

  // Safely look up nested keys in translations: 'nav.searchPlaceholder'
  const t = useCallback(
    (keyPath, fallback = '') => {
      if (!keyPath) return fallback;

      const keys = keyPath.split('.');
      const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.uz;
      const fallbackDict = TRANSLATIONS.uz;

      let val = langDict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }

      if (val !== undefined && typeof val !== 'object') {
        return val;
      }

      // Fallback to Uzbek if translation missing
      let fbVal = fallbackDict;
      for (const k of keys) {
        if (fbVal && typeof fbVal === 'object' && k in fbVal) {
          fbVal = fbVal[k];
        } else {
          fbVal = undefined;
          break;
        }
      }

      if (fbVal !== undefined && typeof fbVal !== 'object') {
        return fbVal;
      }

      return fallback || keyPath;
    },
    [currentLanguage]
  );

  // Translate category by id or category object
  const getCategoryName = useCallback(
    (categoryOrId) => {
      if (!categoryOrId) return '';
      const id = typeof categoryOrId === 'object' ? categoryOrId.id : categoryOrId;
      const defaultName = typeof categoryOrId === 'object' ? categoryOrId.name : '';

      if (CATEGORY_TRANSLATIONS[id]) {
        const entry = CATEGORY_TRANSLATIONS[id];
        return entry[currentLanguage] || entry.uz || defaultName || id;
      }

      return defaultName || id;
    },
    [currentLanguage]
  );

  // Localized cities list for city selector
  const localizedCities = useMemo(() => {
    return Object.entries(CITIES_TRANSLATIONS).map(([key, data]) => {
      const name = data.name[currentLanguage] || data.name.uz;
      const time = data.time[currentLanguage] || data.time.uz;
      return {
        id: key,
        name,
        time,
        rawName: data.name.uz // stable key for localStorage
      };
    });
  }, [currentLanguage]);

  // Translate a city name for display
  const getLocalizedCityName = useCallback(
    (cityNameOrId) => {
      if (!cityNameOrId) return '';
      // check if it matches an id
      if (CITIES_TRANSLATIONS[cityNameOrId]) {
        return CITIES_TRANSLATIONS[cityNameOrId].name[currentLanguage] || CITIES_TRANSLATIONS[cityNameOrId].name.uz;
      }
      // check if it matches an Uzbek name
      const entry = Object.values(CITIES_TRANSLATIONS).find(
        (c) => c.name.uz.toLowerCase() === String(cityNameOrId).toLowerCase()
      );
      if (entry) {
        return entry.name[currentLanguage] || entry.name.uz;
      }
      return cityNameOrId;
    },
    [currentLanguage]
  );

  return {
    t,
    currentLanguage,
    setLanguage,
    getCategoryName,
    localizedCities,
    getLocalizedCityName
  };
};
