<template>
  <div class="register-page">
    <div class="page-header">
      <h1>{{ t('register.title') }}</h1>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">{{ t('register.name') }}</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required
            autocomplete="name"
          />
        </div>
        
        <div class="form-group">
          <label for="email">{{ t('register.email') }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">{{ t('register.password') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            autocomplete="new-password"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">{{ t('register.confirmPassword') }}</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            autocomplete="new-password"
          />
          <div v-if="passwordMismatch" class="error-text">
            Passwords do not match
          </div>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="register-button" 
            :disabled="isLoading || passwordMismatch"
          >
            <span v-if="isLoading">{{ t('common.loading') }}</span>
            <span v-else>{{ t('register.registerButton') }}</span>
          </button>
        </div>
        
        <div class="form-links">
          <p>
            {{ t('register.haveAccount') }} 
            <router-link to="/login">{{ t('register.loginLink') }}</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTranslation } from '../composables/useTranslation';
import axios from 'axios';

export default {
  name: 'RegisterPage',
  setup() {
    const { t } = useTranslation();
    const router = useRouter();
    
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const isLoading = ref(false);
    
    const passwordMismatch = computed(() => {
      return password.value && confirmPassword.value && password.value !== confirmPassword.value;
    });
    
    const handleRegister = async () => {
      if (passwordMismatch.value) {
        return;
      }
      
      isLoading.value = true;
      error.value = '';
      
      try {
        // Call the registration API endpoint
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          email: email.value,
          password: password.value,
          passwordConfirm: confirmPassword.value,
          name: name.value
        });
        
        // If registration successful, log the user in
        if (response.status === 201) {
          const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: email.value,
            password: password.value
          });
          
          // Store token from login response
          if (loginResponse.data && loginResponse.data.token) {
            localStorage.setItem('token', loginResponse.data.token);
            
            // Redirect to sign page after successful registration and login
            router.push('/sign');
          } else {
            throw new Error('No token received from server');
          }
        }
      } catch (err) {
        console.error('Registration error:', err);
        error.value = t('errors.registrationFailed');
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      name,
      email,
      password,
      confirmPassword,
      passwordMismatch,
      error,
      isLoading,
      handleRegister,
      t
    };
  }
}
</script>

<style scoped>
.register-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-message {
  color: #dc3545;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
}

.form-actions {
  margin-top: 1rem;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.register-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.form-links {
  text-align: center;
  margin-top: 1rem;
}

.form-links a {
  color: #007bff;
  text-decoration: none;
}

.form-links a:hover {
  text-decoration: underline;
}
</style> 