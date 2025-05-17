<template>
  <div class="sign-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t('signPage.title') }}</h1>
        <div class="page-description">
          <p>{{ $t('signPage.description') }}</p>
        </div>
      </div>
      
      <div class="sign-content">
        <div v-if="isLoading" class="sign-loading">
          <div class="loader"></div>
          <p>{{ $t('signPage.loading') }}</p>
        </div>
        
        <div v-else-if="error" class="sign-error">
          <div class="error-icon">!</div>
          <div class="error-content">
            <h3>{{ $t('signPage.errorTitle') }}</h3>
            <p>{{ error }}</p>
            <router-link to="/" class="btn btn-secondary">{{ $t('signPage.alreadySigned.homeButton') }}</router-link>
          </div>
        </div>
        
        <div v-else-if="hasUserSigned" class="sign-already-signed">
          <div class="icon-check">✓</div>
          <h3>{{ $t('signPage.alreadySigned.title') }}</h3>
          <p>{{ $t('signPage.alreadySigned.description') }}</p>
          <div class="action-links">
            <router-link to="/profile" class="btn btn-primary">{{ $t('signPage.alreadySigned.viewProfileButton') }}</router-link>
            <router-link to="/" class="btn btn-secondary">{{ $t('signPage.alreadySigned.homeButton') }}</router-link>
          </div>
        </div>
        
        <div v-else class="sign-form-container">
          <SignForm 
            :user="user" 
            @submit="handleSignatureSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api/axios-client';
import SignForm from '../components/SignForm.vue';
import config from '../config';

export default {
  name: 'SignPage',
  components: {
    SignForm
  },
  data() {
    return {
      user: null,
      hasUserSigned: false,
      signature: null,
      isLoading: true,
      error: null
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      this.fetchUserData(token);
    },
    async fetchUserData(token) {
      this.isLoading = true;
      this.error = null;
      
      try {
        this.hasUserSigned = false;
        
        const response = await apiClient.get('/auth/me');
        if (response.data) {
          this.user = {
            id: response.data.id,
            email: response.data.email || '',
            name: response.data.name || ''
          };
        } else {
          throw new Error('Failed to get user data');
        }
        
        await this.checkExistingSignature();
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
            const baseApiUrl = config.apiBaseUrl.replace(/\/api$/, '');
            this.error = `Cannot connect to API server. Please make sure the backend is running at ${baseApiUrl}`;
          } else if (err.response) {
            this.error = `Failed to process user data: ${err.response.status} ${err.response.statusText}`;
          } else {
            this.error = `Failed to process user data: ${err.message}`;
          }
        }
      } finally {
        this.isLoading = false;
      }
    },
    async checkExistingSignature() {
      try {
        const response = await apiClient.get('/signatures/me');
        
        if (response.data && response.data.id) {
          this.signature = response.data;
          this.hasUserSigned = true;
        } else {
          this.hasUserSigned = false;
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.hasUserSigned = false;
        } else if (err.response) {
          this.error = `Failed to check if you have already signed: ${err.response.status} ${err.response.statusText}`;
        } else {
          this.error = 'Failed to connect to the server. Please try again later.';
        }
      }
    },
    async handleSignatureSubmit(signatureData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const apiData = {
          userId: signatureData.userId,
          agreeCheckbox: signatureData.agreeCheckbox,
          publicDisplay: signatureData.publicDisplay
        };
        
        await apiClient.post('/signatures', apiData);
        
        this.$router.push('/thank-you');
      } catch (err) {
        if (err.response) {
          if (err.response.status === 409) {
            this.hasUserSigned = true;
            this.$router.push('/profile');
          } else if (err.response.status === 400) {
            this.error = 'Invalid form data. Please check all fields are filled correctly.';
          } else {
            this.error = `Failed to sign the petition: ${err.response.data?.message || 'Unknown error'}`;
          }
        } else {
          this.error = 'Connection error. Please check your internet connection.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.sign-page {
  min-height: 100vh;
  padding: var(--spacing-xxl) 0;
  position: relative;
}

.sign-page::before {
  content: 'SIGN';
  position: absolute;
  top: 0;
  right: 5%;
  font-size: calc(var(--font-size-jumbo) * 2);
  font-weight: 800;
  opacity: 0.04;
  color: var(--primary);
  letter-spacing: -5px;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.page-title {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

.page-title::before {
  content: '"';
  position: absolute;
  left: -15px;
  top: -5px;
  font-size: 0.8em;
  font-weight: 700;
  color: var(--secondary);
}

.page-title::after {
  content: '"';
  position: absolute;
  right: -15px;
  top: -5px;
  font-size: 0.8em;
  font-weight: 700;
  color: var(--secondary);
}

.page-description {
  max-width: 600px;
  margin: var(--spacing-lg) auto 0;
  position: relative;
}

.page-description::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 3px;
  background: var(--gradient-primary);
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
}

.page-description p {
  font-size: var(--font-size-lg);
  color: var(--grey-dark);
}

.sign-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.sign-loading,
.sign-error,
.sign-already-signed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-xl) auto;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.sign-loading::after,
.sign-error::after,
.sign-already-signed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--grey-light);
  border-radius: 50%;
  border-top-color: var(--secondary);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sign-error {
  border-left: 4px solid var(--error);
  text-align: left;
  flex-direction: row;
  align-items: flex-start;
}

.sign-error::before {
  content: 'ERROR';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: var(--font-size-xs);
  font-weight: 800;
  color: var(--error);
  opacity: 0.1;
}

.error-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--error);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-content h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--error);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.error-content p {
  margin-bottom: var(--spacing-md);
}

.sign-already-signed {
  background-color: var(--light);
  position: relative;
}

.sign-already-signed::before {
  content: 'SIGNED';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: var(--font-size-xs);
  font-weight: 800;
  color: var(--success);
  opacity: 0.1;
}

.icon-check {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.sign-already-signed h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sign-already-signed p {
  margin-bottom: var(--spacing-lg);
  color: var(--grey-dark);
}

.action-links {
  display: flex;
  gap: var(--spacing-md);
}

.sign-form-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--grey-light);
  position: relative;
}

.sign-form-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 5px;
  background: var(--gradient-primary);
  top: 0;
  left: 0;
}

@media (max-width: 768px) {
  .action-links {
    flex-direction: column;
    width: 100%;
  }
  
  .page-title {
    font-size: var(--font-size-xl);
  }
  
  .page-description p {
    font-size: var(--font-size-md);
  }
  
  .sign-page::before {
    font-size: calc(var(--font-size-jumbo) * 1.2);
    opacity: 0.03;
  }
}
</style> 