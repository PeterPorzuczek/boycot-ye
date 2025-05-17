<template>
  <div class="register-page">
    <div class="page-header">
      <div class="page-title-wrap">
        <h1>{{ t('register.title') }}</h1>
        <div class="subtitle">{{ t('register.subtitle') }}</div>
      </div>
      <div class="decoration-element">{{ t('register.joinMovement') }}</div>
    </div>
    
    <div class="form-container">
      <div class="form-banner">
        <div class="banner-text">{{ t('register.createToSign') }}</div>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">{{ t('register.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required
              autocomplete="name"
            />
            <div class="input-icon">👤</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">{{ t('register.email') }}</label>
          <div class="input-wrapper">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              autocomplete="email"
            />
            <div class="input-icon">✉</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">{{ t('register.password') }}</label>
          <div class="input-wrapper">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
              autocomplete="new-password"
            />
            <div class="input-icon">🔒</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">{{ t('register.confirmPassword') }}</label>
          <div class="input-wrapper">
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required
              autocomplete="new-password"
            />
            <div class="input-icon">🔐</div>
          </div>
          <div v-if="passwordMismatch" class="error-text">
            {{ t('register.passwordMismatch') }}
          </div>
        </div>
        
        <div v-if="error" class="error-message">
          <div class="error-icon">!</div>
          <span>{{ error }}</span>
        </div>
        
        <div class="terms-notice">
          <div class="terms-icon">📝</div>
          <div class="terms-text">{{ t('register.termsText') }}</div>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="register-button" 
            :disabled="isLoading || passwordMismatch"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>{{ t('register.registerButton') }}</span>
          </button>
        </div>
        
        <div class="form-links">
          <div class="divider">
            <span>{{ t('register.haveAccount') }}</span>
          </div>
          <router-link to="/login" class="login-link">{{ t('register.loginLink') }}</router-link>
        </div>
      </form>
    </div>
    
    <div class="unity-banner">
      <div class="unity-message">{{ t('register.unityBanner') }}</div>
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
  padding: 0 var(--spacing-lg);
  position: relative;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
  padding-top: var(--spacing-xl);
}

.page-title-wrap {
  position: relative;
  z-index: 2;
}

.page-header h1 {
  font-size: var(--font-size-xxl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin-bottom: var(--spacing-xs);
  position: relative;
  display: inline-block;
}

.page-header h1::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.subtitle {
  color: var(--grey-dark);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-md);
  font-style: italic;
}

.decoration-element {
  position: absolute;
  top: -10px;
  right: -10px;
  color: var(--grey-light);
  font-size: calc(var(--font-size-jumbo) * 0.7);
  font-weight: 800;
  opacity: 0.1;
  letter-spacing: -2px;
  z-index: 1;
  transform: rotate(-5deg);
  pointer-events: none;
  max-width: 400px;
  line-height: 0.9;
}

.form-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.form-banner {
  background: var(--gradient-primary);
  padding: var(--spacing-md);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.form-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 10px,
    rgba(0, 0, 0, 0.05) 10px,
    rgba(0, 0, 0, 0.05) 20px
  );
}

.banner-text {
  color: white;
  font-weight: 700;
  font-size: var(--font-size-md);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  font-size: var(--font-size-xs);
  letter-spacing: 1px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--grey-mid);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  transition: all 0.3s;
  background-color: var(--off-white);
  padding-right: 40px;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(247, 197, 72, 0.2);
  transform: translateY(-2px);
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--grey-dark);
  font-size: var(--font-size-md);
}

.error-text {
  color: var(--secondary);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
  font-weight: 600;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(255, 0, 0, 0.05);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--secondary);
}

.error-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--secondary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 14px;
}

.terms-notice {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: rgba(93, 33, 210, 0.05);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--accent-2);
}

.terms-icon {
  color: var(--accent-2);
}

.terms-text {
  font-size: var(--font-size-sm);
  color: var(--primary);
}

.form-actions {
  margin-top: var(--spacing-md);
}

.register-button {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: height 0.3s;
  z-index: 1;
}

.register-button:hover:not(:disabled)::after {
  height: 100%;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.register-button:disabled {
  background: var(--grey-mid);
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-links {
  text-align: center;
  margin-top: var(--spacing-lg);
  position: relative;
}

.divider {
  position: relative;
  height: 20px;
  margin-bottom: var(--spacing-md);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--grey-light);
}

.divider span {
  position: relative;
  background-color: white;
  padding: 0 var(--spacing-md);
  color: var(--grey-dark);
  font-size: var(--font-size-sm);
}

.login-link {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-xl);
  background-color: transparent;
  color: var(--accent-2);
  border: 2px solid var(--accent-2);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: var(--font-size-sm);
  transition: all 0.3s;
}

.login-link:hover {
  background-color: var(--accent-2);
  color: white;
  transform: translateY(-2px);
}

.unity-banner {
  margin-top: var(--spacing-xxl);
  padding: var(--spacing-md);
  background: var(--gradient-primary);
  text-align: center;
  border-radius: var(--border-radius-md);
  position: relative;
  overflow: hidden;
}

.unity-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 10px,
    rgba(0, 0, 0, 0.05) 10px,
    rgba(0, 0, 0, 0.05) 20px
  );
}

.unity-message {
  color: white;
  font-weight: 800;
  font-size: var(--font-size-lg);
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

@media (max-width: 768px) {
  .register-page {
    padding: 0 var(--spacing-md);
  }
  
  .decoration-element {
    display: none;
  }
}
</style> 