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
      
      const base64Url = token.value.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const tokenData = JSON.parse(jsonPayload);
      console.log('JWT token data:', tokenData);
      
      
      user.value = {
        id: tokenData.sub || tokenData.id || tokenData.userId, 
        email: tokenData.email || '',
        name: tokenData.name || tokenData.username || ''
      };
      
      console.log('Created user object:', user.value);
      
    } catch (err) {
      console.error('Error extracting user data from token:', err);
      error.value = 'Could not extract user data from token';
      
      
      localStorage.removeItem('token');
      token.value = null;
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