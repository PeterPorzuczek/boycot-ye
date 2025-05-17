import { ref, computed } from 'vue';
import { signatureApi } from '../api/signatures';
import { useRouter } from 'vue-router';

export function useSignature() {
  const signature = ref(null);
  const hasUserSigned = computed(() => !!signature.value);
  const isCreatingSignature = ref(false);
  const isFetchingSignature = ref(false);
  const error = ref(null);
  const router = useRouter();

  // Pobieranie podpisu użytkownika
  const fetchUserSignature = async () => {
    isFetchingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.getCurrentUserSignature();
      signature.value = response.data;
      return signature.value;
    } catch (err) {
      // Ignorujemy 404, bo to oznacza, że użytkownik nie podpisał jeszcze petycji
      if (err.response && err.response.status !== 404) {
        console.error('Błąd podczas pobierania podpisu:', err);
        error.value = 'Nie udało się pobrać informacji o podpisie';
      }
      return null;
    } finally {
      isFetchingSignature.value = false;
    }
  };

  // Tworzenie podpisu
  const createSignature = async (signatureData) => {
    isCreatingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.createSignature(signatureData);
      signature.value = response.data;
      
      // Po udanym podpisaniu przekieruj na stronę podziękowania
      router.push('/thank-you');
      
      return signature.value;
    } catch (err) {
      console.error('Błąd podczas tworzenia podpisu:', err);
      
      if (err.response) {
        if (err.response.status === 409) {
          error.value = 'Już podpisałeś tę petycję';
          // Przekieruj do profilu, jeśli użytkownik już podpisał
          router.push('/profile');
        } else if (err.response.status === 400) {
          error.value = 'Nieprawidłowe dane formularza. Sprawdź czy wszystkie pola są poprawnie wypełnione.';
        } else {
          error.value = 'Wystąpił błąd podczas składania podpisu. Spróbuj ponownie później.';
        }
      } else {
        error.value = 'Wystąpił problem z połączeniem. Sprawdź swoje połączenie internetowe.';
      }
      
      return null;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  return {
    signature,
    hasUserSigned,
    isCreatingSignature,
    isFetchingSignature,
    error,
    fetchUserSignature,
    createSignature
  };
} 