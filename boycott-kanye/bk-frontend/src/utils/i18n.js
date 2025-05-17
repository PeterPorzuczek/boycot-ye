import translations from '@/assets/translations.json';

const getNestedValue = (obj, path) => {
  if (!path) return '';
  
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === undefined || value === null) return path;
    value = value[key];
  }
  
  if (typeof value !== 'string') return path;
  return value;
};

export const t = (key, params = {}) => {
  const text = getNestedValue(translations, key);
  
  if (params && Object.keys(params).length) {
    return Object.keys(params).reduce((acc, paramKey) => {
      return acc.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
    }, text);
  }
  
  return text;
};

export default {
  install(app) {
    app.config.globalProperties.$t = t;
  }
}; 