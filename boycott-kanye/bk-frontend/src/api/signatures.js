import axios from 'axios';

// Konfiguracja axios z bazowym URL z konfiguracji
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

// Metody API dla podpisów
export const signatureApi = {
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