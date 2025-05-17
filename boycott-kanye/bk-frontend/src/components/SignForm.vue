<template>
  <form @submit.prevent="handleSubmit" class="sign-form">
    <UserInfoSection :user="user" />
    
    <ConsentCheckbox
      v-model="formState.agreeCheckbox"
      :error="formErrors.agreeCheckbox"
    />
    
    <VisibilityToggle
      v-model="formState.publicDisplay"
    />
    
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
import { reactive, computed } from 'vue';
import { useTranslation } from '../composables/useTranslation';
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
      required: true
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const { t } = useTranslation();
    
    // Form state
    const formState = reactive({
      agreeCheckbox: false,
      publicDisplay: true,
      isSubmitting: false,
      error: null
    });
    
    // Form errors
    const formErrors = reactive({
      agreeCheckbox: ''
    });
    
    // Compute if form is valid
    const isFormValid = computed(() => {
      // Don't modify state in computed function
      return formState.agreeCheckbox;
    });
    
    // Validate form and update errors
    const validateForm = () => {
      // Clear previous errors
      formErrors.agreeCheckbox = '';
      
      // Validate consent checkbox
      if (!formState.agreeCheckbox) {
        formErrors.agreeCheckbox = t('errors.formValidation');
        return false;
      }
      
      return true;
    };
    
    // Handle form submission
    const handleSubmit = () => {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }
      
      formState.isSubmitting = true;
      formState.error = null;
      
      // Create signature data
      const signatureData = {
        userId: props.user.id,
        agreeCheckbox: formState.agreeCheckbox,
        publicDisplay: formState.publicDisplay
      };
      
      // Emit submit event with signature data
      emit('submit', signatureData);
    };
    
    return {
      formState,
      formErrors,
      isFormValid,
      handleSubmit,
      t
    };
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