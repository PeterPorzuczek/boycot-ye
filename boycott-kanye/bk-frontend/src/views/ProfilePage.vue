<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="stop-hate-ribbon">STOP HATE</div>
      <h1 class="text-ye">{{ t('profile.title') }}</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">!</div>
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="profile-content">
      <div class="profile-section signature-status">
        <h2 class="section-title">{{ t('profile.signatureStatus') }}</h2>
        <div v-if="hasUserSigned" class="signed-status">
          <div class="status-icon">✓</div>
          <div class="status-content">
            <p class="status-text">{{ t('profile.signed') }}</p>
            <p class="signature-date">Signed on: {{ formatDate(signature?.created) }}</p>
            <div class="impact-message">You've joined the movement against hate speech</div>
          </div>
        </div>
        <div v-else class="not-signed-status">
          <div class="status-icon">✗</div>
          <div class="status-content">
            <p class="status-text">{{ t('profile.notSigned') }}</p>
            <p class="take-stand-message">Take a stand against antisemitism and hate speech</p>
            <router-link to="/sign" class="sign-link btn btn-primary">{{ t('home.signButton') }}</router-link>
          </div>
        </div>
      </div>
      
      <div v-if="hasUserSigned" class="profile-section signature-visibility">
        <div class="section-header">
          <h2 class="section-title">{{ t('profile.visibilityTitle') }}</h2>
          <div class="section-subtitle">Control how your voice is heard</div>
        </div>
        
        <div class="visibility-option-container">
          <div class="visibility-toggle-wrapper">
            <label class="visibility-toggle" :class="{ 'disabled': isUpdatingVisibility }">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="publicDisplay"
                  @change="handleVisibilityChange"
                  :disabled="isUpdatingVisibility"
                />
                <span class="slider">
                  <span class="slider-text on">ON</span>
                  <span class="slider-text off">OFF</span>
                </span>
              </div>
              <div class="toggle-label-group">
                <span class="toggle-label">{{ t('profile.visibilityLabel') }}</span>
                <span class="status-badge" :class="{ 'public': publicDisplay, 'private': !publicDisplay }">
                  {{ publicDisplay ? 'PUBLIC' : 'PRIVATE' }}
                </span>
              </div>
            </label>
          </div>
          
          <div class="visibility-preview">
            <div class="preview-header">
              <span class="preview-label">PREVIEW</span>
            </div>
            <div class="preview-card">
              <div class="preview-tag" :class="{ 'public': publicDisplay, 'private': !publicDisplay }">
                {{ publicDisplay ? 'PUBLIC' : 'PRIVATE' }}
              </div>
              <div class="preview-icon">{{ publicDisplay ? '👤' : '🔒' }}</div>
              <div class="preview-content">
                <div class="preview-name">{{ publicDisplay ? 'Your Full Name' : 'Anonymous' }}</div>
                <div v-if="publicDisplay" class="preview-email">y***@example.com</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isUpdatingVisibility" class="status-message updating">
          <div class="status-indicator"></div>
          {{ t('common.updating') }}
        </div>
        <div v-else-if="updateSuccess" class="status-message success">
          <div class="status-icon">✓</div>
          {{ t('profile.updateSuccess') }}
        </div>
        
        <div class="visibility-note">
          <span class="note-marker">*</span>
          <span class="note-text">When private, your signature will appear as "Anonymous" in the public signatures list.</span>
        </div>
      </div>
      
      <div v-if="hasUserSigned" class="profile-section withdraw-signature">
        <div class="section-decorative-element"></div>
        <h2 class="section-title">{{ t('profile.withdrawTitle') }}</h2>
        <p class="withdraw-info">If you wish to remove your signature from this petition, you can withdraw it. This action cannot be undone.</p>
        <button 
          @click="confirmWithdraw" 
          class="withdraw-button"
          :disabled="isWithdrawing"
        >
          <span v-if="isWithdrawing" class="loading-spinner"></span>
          <span v-else>{{ t('profile.withdrawButton') }}</span>
        </button>
      </div>
    </div>
    
    <div class="unity-banner">
      <div class="unity-message">UNITED AGAINST HATE</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useSignature } from '../composables/useSignature';
import { useTranslation } from '../composables/useTranslation';
import apiClient from '../api/axios-client';

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
      deleteSignature
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
          // API returns public_display (snake_case), but in our model we use publicDisplay (camelCase)
          publicDisplay.value = !!result.public_display;
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
      
      try {
        // The API expects publicDisplay (camelCase) in request body according to UpdateSignatureDto
        const response = await apiClient.put(
          `/signatures/${signature.value.id}`,
          { publicDisplay: publicDisplay.value } // Using camelCase in the request!
        );
        
        if (response.status === 200) {
          updateSuccess.value = true;
          
          // Response returns an object with public_display (snake_case)
          if (response.data) {
            signature.value = response.data;
          }
          
          // Hide the success message after a few seconds
          setTimeout(() => {
            updateSuccess.value = false;
          }, 3000);
        }
      } catch (err) {
        error.value = t('errors.updateSignatureFailed');
        // Reset checkbox state on error
        if (signature.value && signature.value.public_display !== undefined) {
          publicDisplay.value = !!signature.value.public_display;
        }
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
  padding: 0 var(--spacing-lg);
  position: relative;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  position: relative;
  padding-top: var(--spacing-xl);
}

.stop-hate-ribbon {
  position: absolute;
  top: 0;
  right: -50px;
  background: var(--gradient-pablo);
  color: var(--primary-dark);
  padding: 8px 40px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: var(--font-size-sm);
  transform: rotate(45deg) translateX(30px);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--shadow-md);
  z-index: 1;
}

.page-header h1 {
  font-size: var(--font-size-xxl);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);
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

.loading-container,
.error-container {
  text-align: center;
  padding: var(--spacing-xl);
  margin: var(--spacing-xl) auto;
  max-width: 600px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.error-container {
  text-align: left;
  flex-direction: row;
  align-items: flex-start;
  border-left: 4px solid var(--error);
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
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.profile-section {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  margin-top: 0;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.section-subtitle {
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
  font-style: italic;
  margin-top: var(--spacing-xs);
}

.section-title::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 3px;
  background: var(--gradient-primary);
  bottom: -8px;
  left: 0;
}

.signed-status,
.not-signed-status {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
}

.signed-status {
  background-color: rgba(247, 197, 72, 0.1);
  color: var(--accent);
  border-left: 3px solid var(--accent);
}

.not-signed-status {
  background-color: rgba(255, 0, 0, 0.05);
  color: var(--secondary);
  border-left: 3px solid var(--secondary);
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.signed-status .status-icon {
  background: var(--gradient-accent);
  color: white;
}

.not-signed-status .status-icon {
  background: var(--secondary);
  color: white;
}

.status-content {
  flex: 1;
}

.status-text {
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-lg);
}

.signature-date {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.impact-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(93, 33, 210, 0.1);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--accent-2);
  display: inline-block;
}

.take-stand-message {
  font-size: var(--font-size-sm);
  font-style: italic;
  margin-bottom: var(--spacing-md);
  color: var(--primary);
}

.sign-link {
  display: inline-block;
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Visibility Section Styles */
.visibility-option-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.visibility-toggle-wrapper {
  background-color: var(--off-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--grey-light);
}

.visibility-toggle {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.visibility-toggle.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;
  margin-bottom: var(--spacing-md);
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-dark);
  transition: .4s;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.slider-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 700;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-text.on {
  right: 7px;
  color: white;
  opacity: 0;
}

.slider-text.off {
  left: 7px;
  color: var(--grey-light);
  opacity: 1;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

input:checked + .slider {
  background: var(--gradient-primary);
}

input:checked + .slider .slider-text.on {
  opacity: 1;
}

input:checked + .slider .slider-text.off {
  opacity: 0;
}

input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(247, 197, 72, 0.2);
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.toggle-label-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.toggle-label {
  font-weight: 600;
  font-size: var(--font-size-md);
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-xs);
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
}

.status-badge.public {
  background: var(--accent);
  color: var(--primary-dark);
}

.status-badge.private {
  background: var(--grey-dark);
  color: white;
}

.visibility-preview {
  background-color: white;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--grey-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.preview-header {
  background: var(--primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  display: flex;
  justify-content: center;
}

.preview-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 1px;
}

.preview-card {
  padding: var(--spacing-md);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.preview-tag {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
}

.preview-tag.public {
  background: var(--accent);
  color: var(--primary-dark);
}

.preview-tag.private {
  background: var(--grey-dark);
  color: white;
}

.preview-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--light);
  border-radius: 50%;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.preview-email {
  font-size: var(--font-size-xs);
  color: var(--grey-dark);
}

.status-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  font-weight: 500;
}

.status-message.updating {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.status-message.success {
  background-color: rgba(0, 193, 112, 0.1);
  color: var(--success);
}

.status-indicator {
  width: 16px;
  height: 16px;
  border: 2px solid var(--warning);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
}

.status-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-right: var(--spacing-sm);
}

.visibility-note {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.note-marker {
  color: var(--secondary);
  margin-right: var(--spacing-xs);
  font-weight: 700;
}

.section-decorative-element {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 60px;
  height: 60px;
  border: 2px solid var(--secondary);
  opacity: 0.2;
  transform: rotate(45deg);
}

.withdraw-info {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: rgba(255, 0, 0, 0.05);
  border-left: 3px solid var(--secondary);
  border-radius: var(--border-radius-sm);
  color: var(--grey-dark);
  line-height: 1.5;
}

.withdraw-button {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.withdraw-button:hover:not(:disabled) {
  background-color: #d00000;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.withdraw-button:disabled {
  background-color: var(--grey-mid);
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
  .profile-page {
    padding: 0 var(--spacing-md);
  }
  
  .visibility-option-container {
    grid-template-columns: 1fr;
  }
  
  .profile-section {
    padding: var(--spacing-lg);
  }
  
  .visibility-toggle {
    flex-direction: column;
  }
}
</style> 