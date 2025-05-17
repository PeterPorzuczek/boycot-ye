<template>
  <div class="visibility-toggle">
    <label class="toggle-container">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="toggle-label">{{ t('sign.visibilityLabel') }}</span>
    </label>
    <div class="visibility-note">
      <small>{{ t('sign.visibilityNote') }}</small>
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'VisibilityToggle',
  props: {
    modelValue: {
      type: Boolean,
      required: true
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
.visibility-toggle {
  margin-bottom: 1.5rem;
}

.toggle-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.toggle-container input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.toggle-label {
  line-height: 1.5;
}

.visibility-note {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}
</style> 