<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>{{ t('profile.title') }}</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="profile-content">
      <div class="profile-section signature-status">
        <h2>{{ t('profile.signatureStatus') }}</h2>
        <div v-if="hasUserSigned" class="signed-status">
          <p class="status-text">{{ t('profile.signed') }}</p>
          <p class="signature-date">Signed on: {{ formatDate(signature?.created) }}</p>
        </div>
        <div v-else class="not-signed-status">
          <p class="status-text">{{ t('profile.notSigned') }}</p>
          <router-link to="/sign" class="sign-link">{{ t('home.signButton') }}</router-link>
        </div>
      </div>
      
      <div v-if="hasUserSigned" class="profile-section signature-visibility">
        <h2>{{ t('profile.visibilityTitle') }}</h2>
        <label class="toggle-container" :class="{ 'disabled': isUpdatingVisibility }">
          <input
            type="checkbox"
            v-model="publicDisplay"
            @change="handleVisibilityChange"
            :disabled="isUpdatingVisibility"
          />
          <span class="toggle-label">{{ t('profile.visibilityLabel') }}</span>
        </label>
        <div v-if="isUpdatingVisibility" class="loading-message">
          {{ t('common.updating') }}
        </div>
        <div v-else-if="updateSuccess" class="success-message">
          {{ t('profile.updateSuccess') }}
        </div>
      </div>
      
      <div v-if="hasUserSigned" class="profile-section withdraw-signature">
        <h2>{{ t('profile.withdrawTitle') }}</h2>
        <button 
          @click="confirmWithdraw" 
          class="withdraw-button"
          :disabled="isWithdrawing"
        >
          <span v-if="isWithdrawing">{{ t('common.loading') }}</span>
          <span v-else>{{ t('profile.withdrawButton') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useSignature } from '../composables/useSignature';
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'ProfilePage',
  setup() {
    const { t } = useTranslation();
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { 
      signature, 
      hasUserSigned, 
      isFetchingSignature,
      error: signatureError,
      fetchUserSignature,
      deleteSignature,
      updateSignatureVisibility
    } = useSignature();
    
    const publicDisplay = ref(false);
    const isLoading = ref(true);
    const isWithdrawing = ref(false);
    const isUpdatingVisibility = ref(false);
    const error = ref('');
    const updateSuccess = ref(false);
    
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Fetch user signature on mount
    onMounted(async () => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      try {
        isLoading.value = true;
        const result = await fetchUserSignature();
        if (result) {
          // Handle both property formats that could come from the API
          publicDisplay.value = 
            result.public_display !== undefined ? result.public_display : 
            result.publicDisplay !== undefined ? result.publicDisplay : 
            false;
        }
      } catch (err) {
        error.value = t('errors.fetchSignatureFailed');
      } finally {
        isLoading.value = false;
      }
    });
    
    // Handle visibility change
    const handleVisibilityChange = async () => {
      if (!signature.value || !signature.value.id) {
        error.value = t('errors.updateSignatureFailed');
        return;
      }
      
      isUpdatingVisibility.value = true;
      error.value = null;
      updateSuccess.value = false;
      
      console.log('Updating visibility to:', publicDisplay.value);
      console.log('Signature ID:', signature.value.id);
      
      try {
        // Call the API to update the signature visibility
        const success = await updateSignatureVisibility(
          signature.value.id, 
          publicDisplay.value
        );
        
        console.log('Update result:', success);
        
        if (success) {
          updateSuccess.value = true;
          
          // Hide the success message after a few seconds
          setTimeout(() => {
            updateSuccess.value = false;
          }, 3000);
        } else {
          error.value = t('errors.updateSignatureFailed');
        }
      } catch (err) {
        console.error('Failed to update visibility:', err);
        error.value = t('errors.updateSignatureFailed');
        // Reset the checkbox to its previous state on error
        publicDisplay.value = signature.value.public_display;
      } finally {
        isUpdatingVisibility.value = false;
      }
    };
    
    // Confirm signature withdrawal
    const confirmWithdraw = () => {
      if (window.confirm(t('profile.withdrawConfirm'))) {
        withdrawSignature();
      }
    };
    
    // Withdraw signature
    const withdrawSignature = async () => {
      if (!signature.value || !signature.value.id) {
        error.value = t('errors.deleteSignatureFailed');
        return;
      }
      
      isWithdrawing.value = true;
      error.value = null;
      
      try {
        // Call the API to delete the signature
        const success = await deleteSignature(signature.value.id);
        
        if (success) {
          // Show a temporary success message
          alert('Your signature has been successfully withdrawn');
          
          // Refresh the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          error.value = t('errors.deleteSignatureFailed');
        }
      } catch (err) {
        console.error('Failed to withdraw signature:', err);
        error.value = t('errors.deleteSignatureFailed');
      } finally {
        isWithdrawing.value = false;
      }
    };
    
    return {
      signature,
      hasUserSigned,
      publicDisplay,
      isLoading: computed(() => isLoading.value || isFetchingSignature.value),
      isWithdrawing,
      isUpdatingVisibility,
      error: computed(() => error.value || signatureError.value),
      updateSuccess,
      formatDate,
      handleVisibilityChange,
      confirmWithdraw,
      t
    };
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.loading-container,
.error-container {
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.profile-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.signed-status,
.not-signed-status {
  padding: 1rem;
  border-radius: 4px;
}

.signed-status {
  background-color: #d4edda;
  color: #155724;
}

.not-signed-status {
  background-color: #f8d7da;
  color: #721c24;
}

.status-text {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.signature-date {
  font-size: 0.9rem;
}

.sign-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-container input[type="checkbox"] {
  margin-right: 0.5rem;
}

.toggle-container.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-message {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e2e3e5;
  color: #383d41;
  border-radius: 4px;
}

.success-message {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.withdraw-button {
  padding: 0.75rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.withdraw-button:hover:not(:disabled) {
  background-color: #c82333;
}

.withdraw-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 