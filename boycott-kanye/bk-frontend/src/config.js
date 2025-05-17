// Configuration values for the application
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  // API Base URL - with different defaults for development and production
  // In development, use localhost directly
  // In production, a placeholder will be replaced at runtime by Docker entrypoint
  apiBaseUrl: process.env.VUE_APP_API_URL || 
              (isDevelopment 
                ? 'http://localhost:3000/api' 
                : 'VUE_APP_API_URL_PLACEHOLDER')
}; 