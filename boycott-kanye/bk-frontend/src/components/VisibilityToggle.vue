<template>
  <div class="visibility-toggle">
    <div class="visibility-info">
      <p>Choose how your signature appears in the public petition list:</p>
    </div>
    <label class="toggle-container">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="toggle-label">{{ $t('sign.visibilityLabel') }}</span>
    </label>
    <div class="visibility-note">
      <small>{{ $t('sign.visibilityNote') }}</small>
    </div>
    <div class="visibility-preview">
      <p><strong>Preview:</strong> Your signature will appear as: 
        <span v-if="modelValue" class="preview-example">{{ getVisibilityPreview(true) }}</span>
        <span v-else class="preview-example">{{ getVisibilityPreview(false) }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisibilityToggle',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    // Method to show how signature will appear in public list
    getVisibilityPreview(isPublic) {
      return isPublic ? "Your Full Name, j***@example.com" : "Anonymous, j***@example.com";
    }
  }
}
</script>

<style scoped>
.visibility-toggle {
  margin-bottom: 1.5rem;
}

.visibility-info {
  margin-bottom: 1rem;
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

.visibility-preview {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
}

.preview-example {
  font-style: italic;
  background-color: #e9ecef;
  padding: 2px 5px;
  border-radius: 3px;
}
</style> 