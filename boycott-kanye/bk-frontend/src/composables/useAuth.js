import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const isLoggedIn = computed(() => !!token.value);
  const isLoading = ref(false);
  const error = ref(null);

  // Pobieranie danych użytkownika na podstawie tokenu
  const fetchUserData = async () => {
    if (!token.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      user.value = response.data;
    } catch (err) {
      console.error('Błąd podczas pobierania danych użytkownika:', err);
      error.value = 'Nie udało się pobrać danych użytkownika';
      
      // Jeśli błąd autoryzacji, wyczyść token
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        token.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Sprawdzenie stanu autentykacji przy inicjalizacji
  onMounted(() => {
    if (token.value) {
      fetchUserData();
    }
  });

  return {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    fetchUserData
  };
} 