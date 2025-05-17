<template>
  <div class="login-page">
    <div class="page-header">
      <h1>{{ $t('login.title') }}</h1>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('login.email') }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            autocomplete="current-password"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="login-button" 
            :disabled="isLoading"
          >
            <span v-if="isLoading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('login.loginButton') }}</span>
          </button>
        </div>
        
        <div class="form-links">
          <p>
            {{ $t('login.noAccount') }} 
            <router-link to="/register">{{ $t('login.registerLink') }}</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.error = '';
      
      try {
        // Call the actual login API endpoint
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        });
        
        // Store the real token from response
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Redirect to the page the user was trying to access, or to home
          const redirectPath = this.$route.query.redirect || '/';
          this.$router.push(redirectPath);
        } else {
          throw new Error('No token received from server');
        }
        
      } catch (err) {
        console.error('Login error:', err);
        this.error = this.$t('errors.invalidCredentials');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-page {
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

.login-form {
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

.error-message {
  color: #dc3545;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
}

.form-actions {
  margin-top: 1rem;
}

.login-button {
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

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-button:disabled {
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