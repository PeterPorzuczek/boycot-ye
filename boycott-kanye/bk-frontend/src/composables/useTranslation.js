import { ref } from 'vue';
import enTranslations from '../locales/en.json';

// Function for the composition API
export function useTranslation() {
  const locale = ref('en');
  const translations = ref(enTranslations);
  
  /**
   * Get a translation by key path.
   * Example: t('sign.consentLabel')
   * 
   * @param {string} path - Dot notation path to the translation
   * @param {Object} params - Optional parameters to replace in the translation
   * @returns {string} The translated string
   */
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let value = translations.value;
    
    // Navigate through the nested object
    for (const key of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, key)) {
        value = value[key];
      } else {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
    }
    
    // If the value is not a string, return the path
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${path}`);
      return path;
    }
    
    // Replace parameters
    let result = value;
    for (const [key, val] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), val);
    }
    
    return result;
  };

  return {
    locale,
    t
  };
}

// For Options API, create a plugin
export const i18nPlugin = {
  install: (app) => {
    // Translation function
    const t = (path, params = {}) => {
      const keys = path.split('.');
      let value = enTranslations;
      
      // Navigate through the nested object
      for (const key of keys) {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
          value = value[key];
        } else {
          console.warn(`Translation key not found: ${path}`);
          return path;
        }
      }
      
      // If the value is not a string, return the path
      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${path}`);
        return path;
      }
      
      // Replace parameters
      let result = value;
      for (const [key, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), val);
      }
      
      return result;
    };

    // Add global method
    app.config.globalProperties.$t = t;
  }
}; 