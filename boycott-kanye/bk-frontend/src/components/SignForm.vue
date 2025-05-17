<template>
  <form @submit.prevent="handleSubmit" class="sign-form">
    <UserInfoSection :user="user" />
    
    <div class="form-section">
      <h3>Petition Consent</h3>
      <ConsentCheckbox
        v-model="formState.agreeCheckbox"
        :error="formErrors.agreeCheckbox"
      />
    </div>
    
    <div class="form-section">
      <h3>Privacy Settings</h3>
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
      {{ formState.error }}
    </div>
  </form>
</template>

<script>
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
      }
    };
  },
  computed: {
    isFormValid() {
      return this.formState.agreeCheckbox;
    }
  },
  mounted() {
    // Log the user object for debugging
    console.log('SignForm user prop:', this.user);
  },
  methods: {
    validateForm() {
      // Clear previous errors
      this.formErrors.agreeCheckbox = '';
      
      // Validate user data
      if (!this.user || !this.user.id) {
        this.formState.error = 'Missing user information. Please try logging in again.';
        return false;
      }
      
      // Validate consent checkbox
      if (!this.formState.agreeCheckbox) {
        this.formErrors.agreeCheckbox = 'Please check this box to confirm your consent.';
        return false;
      }
      
      return true;
    },
    handleSubmit() {
      // Clear previous errors
      this.formErrors.agreeCheckbox = '';
      this.formState.error = null;
      
      // Validate form
      const isValid = this.validateForm();
      if (!isValid) {
        return;
      }
      
      this.formState.isSubmitting = true;
      
      // Create signature data
      const signatureData = {
        userId: this.user.id,
        agreeCheckbox: this.formState.agreeCheckbox,
        publicDisplay: this.formState.publicDisplay
      };
      
      // Log what we're sending for debugging
      console.log('Emitting signature data:', signatureData);
      
      // Emit submit event with signature data
      this.$emit('submit', signatureData);
      
      // Reset form submission state after a short delay if parent doesn't update it
      setTimeout(() => {
        if (this.formState.isSubmitting) {
          this.formState.isSubmitting = false;
        }
      }, 5000);
    }
  }
}
</script>

<style scoped>
.sign-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.form-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}
</style> 