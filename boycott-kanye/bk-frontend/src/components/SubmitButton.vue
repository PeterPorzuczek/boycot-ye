<template>
  <button
    class="submit-button"
    type="submit"
    :disabled="isSubmitting || !isValid"
  >
    <span v-if="isSubmitting" class="loading-indicator">
      {{ t('common.loading') }}
    </span>
    <span v-else>
      {{ t('sign.signButton') }}
    </span>
  </button>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'SubmitButton',
  props: {
    isSubmitting: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { t } = useTranslation();
    return { t };
  }
}
</script>

<style scoped>
.submit-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-indicator {
  display: inline-block;
}
</style> 