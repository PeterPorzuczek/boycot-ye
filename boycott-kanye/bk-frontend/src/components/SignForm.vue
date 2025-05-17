<template>
  <form @submit.prevent="handleSubmit" class="sign-form">
    <div class="form-section user-info">
      <h2 class="section-title">{{ $t('signForm.userInfo.title') }}</h2>
      <UserInfoSection :user="user" />
    </div>
    
    <div class="form-section petition-consent">
      <h2 class="section-title">{{ $t('signForm.petition.title') }}</h2>
      <ConsentCheckbox
        v-model="formState.agreeCheckbox"
        :error="formErrors.agreeCheckbox"
      />
    </div>
    
    <div class="form-section privacy-settings">
      <h2 class="section-title">{{ $t('signForm.visibility.title') }}</h2>
      <VisibilityToggle
        v-model="formState.publicDisplay"
      />
    </div>
    
    <div class="form-actions">
      <SubmitButton
        :is-submitting="formState.isSubmitting"
        :is-valid="isFormValid"
      />
    </div>
    
    <div v-if="formState.error" class="form-error">
      <div class="error-icon">!</div>
      <p>{{ formState.error }}</p>
    </div>
  </form>
</template>

<script>
import { t } from '@/utils/i18n';
import UserInfoSection from './UserInfoSection.vue';
import ConsentCheckbox from './ConsentCheckbox.vue';
import VisibilityToggle from './VisibilityToggle.vue';
import SubmitButton from './SubmitButton.vue';

export default {
  name: 'SignForm',
  components: {
    UserInfoSection,
    ConsentCheckbox,
    VisibilityToggle,
    SubmitButton
  },
  props: {
    user: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && value.id && value.email && value.name;
      }
    }
  },
  emits: ['submit'],
  data() {
    return {
      formState: {
        agreeCheckbox: false,
        publicDisplay: true,
        isSubmitting: false,
        error: null
      },
      formErrors: {
        agreeCheckbox: ''
      },
      userName: '',
      userEmail: ''
    };
  },
  computed: {
    isFormValid() {
      return this.formState.agreeCheckbox;
    }
  },
  created() {
    if (this.user) {
      this.userName = this.user.name || '';
      this.userEmail = this.user.email || '';
    }
  },
  methods: {
    validateForm() {
      this.formErrors.agreeCheckbox = '';
      
      if (!this.user || !this.user.id) {
        this.formState.error = t('signPage.form.formError');
        return false;
      }
      
      if (!this.formState.agreeCheckbox) {
        this.formErrors.agreeCheckbox = t('signPage.form.consentError');
        return false;
      }
      
      return true;
    },
    handleSubmit() {
      this.formErrors.agreeCheckbox = '';
      this.formState.error = null;
      
      const isValid = this.validateForm();
      if (!isValid) {
        return;
      }
      
      this.formState.isSubmitting = true;
      
      const signatureData = {
        userId: this.user.id,
        email: this.user.email,
        name: this.user.name,
        agreeCheckbox: this.formState.agreeCheckbox,
        publicDisplay: this.formState.publicDisplay
      };
      
      this.$emit('submit', signatureData);
      
      setTimeout(() => {
        if (this.formState.isSubmitting) {
          this.formState.isSubmitting = false;
        }
      }, 5000);
    },
    submitForm() {
      if (!this.formState.agreeCheckbox) {
        this.formErrors.agreeCheckbox = t('signPage.form.consentError');
        return;
      }
      
      const signatureData = {
        userId: this.user.id,
        agreeCheckbox: this.formState.agreeCheckbox,
        publicDisplay: this.formState.publicDisplay
      };
      
      this.$emit('submit', signatureData);
    }
  }
}
</script>

<style scoped>
.sign-form {
  padding: var(--spacing-xl);
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: var(--primary);
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 2px;
  background-color: var(--secondary);
  bottom: -4px;
  left: 0;
}

.user-info {
  background-color: var(--light);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--accent);
}

.petition-consent {
  background-color: rgba(255, 58, 94, 0.05);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--secondary);
}

.privacy-settings {
  background-color: rgba(58, 102, 255, 0.05);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--accent);
}

.form-actions {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.form-error {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: rgba(255, 58, 94, 0.1);
  color: var(--error);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
}

.error-icon {
  width: 24px;
  height: 24px;
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

@media (max-width: 768px) {
  .sign-form {
    padding: var(--spacing-md);
  }
}
</style> 