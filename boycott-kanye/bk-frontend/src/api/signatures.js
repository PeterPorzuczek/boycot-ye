import axios from 'axios';

// Konfiguracja axios z bazowym URL dla API
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Dodanie interceptora dla tokena autoryzacyjnego
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor dla obsługi błędów autoryzacji
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token wygasł lub jest nieprawidłowy - wyloguj użytkownika
      localStorage.removeItem('token');
      // Przekieruj do strony logowania
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Metody API dla podpisów
export const signatureApi = {
  // Pobieranie wszystkich podpisów (publiczny endpoint)
  getAllSignatures() {
    return apiClient.get('/signatures/all');
  },
  
  // Pobieranie podpisu aktualnie zalogowanego użytkownika
  getCurrentUserSignature() {
    return apiClient.get('/signatures/me');
  },
  
  // Utworzenie nowego podpisu
  createSignature(signatureData) {
    return apiClient.post('/signatures', signatureData);
  },
  
  // Usunięcie podpisu
  deleteSignature(id) {
    return apiClient.delete(`/signatures/${id}`);
  }
}; 