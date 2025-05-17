import { ref, computed, onMounted } from 'vue';

export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const isLoggedIn = computed(() => !!token.value);
  const isLoading = ref(false);
  const error = ref(null);

  
  const fetchUserData = async () => {
    if (!token.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const tokenData = JSON.parse(atob(token.value.split('.')[1]));
      
      // Extract user data from token
      user.value = {
        id: tokenData.sub,
        email: tokenData.email,
        name: tokenData.name,
        iat: tokenData.iat,
        exp: tokenData.exp
      };
    } catch (err) {
      // Clear token if parsing fails
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  
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