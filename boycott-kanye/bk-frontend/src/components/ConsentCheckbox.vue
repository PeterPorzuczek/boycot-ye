<template>
  <div class="consent-checkbox">
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="checkbox-label">{{ t('sign.consentLabel') }}</span>
    </label>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'ConsentCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { t } = useTranslation();
    return { t };
  }
}
</script>

<style scoped>
.consent-checkbox {
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  line-height: 1.5;
}

.error-message {
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style> 