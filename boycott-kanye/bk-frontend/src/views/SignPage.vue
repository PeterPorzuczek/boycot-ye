<template>
  <div class="sign-page">
    <div class="page-header">
      <h1>{{ t('sign.title') }}</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <router-link to="/" class="back-link">{{ t('sign.backToHome') }}</router-link>
    </div>
    
    <div v-else-if="hasUserSigned" class="already-signed-container">
      <p>{{ t('sign.alreadySigned') }}</p>
      <router-link to="/profile" class="profile-link">{{ t('header.profile') }}</router-link>
      <router-link to="/" class="back-link">{{ t('sign.backToHome') }}</router-link>
    </div>
    
    <div v-else-if="user" class="form-container">
      <SignForm 
        :user="user" 
        @submit="handleSignatureSubmit"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useSignature } from '../composables/useSignature';
import { useTranslation } from '../composables/useTranslation';
import SignForm from '../components/SignForm.vue';

export default {
  name: 'SignPage',
  components: {
    SignForm
  },
  setup() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const { 
      hasUserSigned, 
      isCreatingSignature, 
      isFetchingSignature, 
      error: signatureError, 
      fetchUserSignature, 
      createSignature 
    } = useSignature();
    const { t } = useTranslation();
    
    const error = ref(null);
    const isLoading = computed(() => isCreatingSignature.value || isFetchingSignature.value);
    
    // Check if user has already signed when the component is mounted
    onMounted(async () => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      try {
        await fetchUserSignature();
        if (hasUserSigned.value) {
          console.log('User has already signed the petition');
        }
      } catch (err) {
        error.value = t('errors.fetchSignatureFailed');
      }
    });
    
    // Handle signature submission from the form
    const handleSignatureSubmit = async (signatureData) => {
      try {
        await createSignature(signatureData);
      } catch (err) {
        error.value = signatureError.value || t('errors.createSignatureFailed');
      }
    };
    
    return {
      user,
      hasUserSigned,
      isLoading,
      error,
      handleSignatureSubmit,
      t
    };
  }
}
</script>

<style scoped>
.sign-page {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.loading-container,
.error-container,
.already-signed-container {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-container {
  color: #721c24;
  background-color: #f8d7da;
}

.back-link,
.profile-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #007bff;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-link:hover,
.profile-link:hover {
  background-color: #0056b3;
}

.profile-link {
  margin-right: 1rem;
}
</style> 