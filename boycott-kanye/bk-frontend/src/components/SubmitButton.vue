<template>
  <button
    type="submit"
    class="submit-button"
    :disabled="isSubmitting || !isValid"
  >
    <span v-if="isSubmitting" class="spinner"></span>
    <span v-else>SIGN THE PETITION</span>
  </button>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    isSubmitting: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.submit-button {
  padding: var(--spacing-md) var(--spacing-xxl);
  background-color: var(--secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  width: 100%;
  max-width: 300px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.submit-button:disabled {
  background-color: var(--grey-mid);
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 