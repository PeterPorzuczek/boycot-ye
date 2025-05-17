<template>
  <div class="consent-checkbox">
    <div class="petition-text">
      <p>{{ $t('signForm.petition.text') }}</p>
    </div>
    <label class="checkbox-container">
      <div class="custom-checkbox">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="checkmark"></span>
      </div>
      <span class="checkbox-label">{{ $t('signForm.petition.checkbox') }}</span>
    </label>
    <div v-if="error" class="error-message">
      <div class="error-icon">!</div>
      {{ error }}
    </div>
  </div>
</template>

<script>
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
  emits: ['update:modelValue']
}
</script>

<style scoped>
.consent-checkbox {
  margin-bottom: var(--spacing-lg);
}

.petition-text {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(255, 58, 94, 0.05);
  border-left: 3px solid var(--secondary);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  line-height: 1.6;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-top: var(--spacing-md);
}

.custom-checkbox {
  position: relative;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  height: 24px;
  width: 24px;
  background-color: var(--light);
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--secondary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label {
  font-weight: 500;
  line-height: 1.5;
  font-size: var(--font-size-md);
}

.error-message {
  color: var(--error);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: rgba(255, 58, 94, 0.1);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
}

.error-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--error);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-sm);
  flex-shrink: 0;
  font-size: 12px;
}
</style> 