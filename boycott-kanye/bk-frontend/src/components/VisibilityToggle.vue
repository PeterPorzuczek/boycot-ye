<template>
  <div class="visibility-toggle">
    <div class="visibility-info">
      <p>Choose how your signature appears in the public petition list:</p>
    </div>
    <label class="toggle-container">
      <div class="toggle-switch">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="slider"></span>
      </div>
      <span class="toggle-label">Show my name publicly in the signatures list</span>
    </label>
    <div class="visibility-note">
      <small>Your email will always be masked for privacy.</small>
    </div>
    <div class="visibility-preview">
      <p><strong>Preview:</strong></p> 
      <div class="preview-signature">
        <div class="preview-card" :class="{ 'active': modelValue }">
          <div class="preview-icon">👤</div>
          <div class="preview-content">
            <div class="preview-name">Your Full Name</div>
            <div class="preview-email">y***@example.com</div>
          </div>
        </div>
        <div class="preview-card" :class="{ 'active': !modelValue }">
          <div class="preview-icon">🔒</div>
          <div class="preview-content">
            <div class="preview-name">Anonymous</div>
          </div>
        </div>
      </div>
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
  emits: ['update:modelValue']
}
</script>

<style scoped>
.visibility-toggle {
  margin-bottom: var(--spacing-lg);
}

.visibility-info {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
  color: var(--grey-dark);
}

.toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: var(--spacing-md);
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
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
  background-color: var(--grey-mid);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent);
}

input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(58, 102, 255, 0.2);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.toggle-label {
  font-weight: 500;
  font-size: var(--font-size-md);
}

.visibility-note {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--grey-mid);
  margin-left: calc(50px + var(--spacing-md));
}

.visibility-preview {
  background-color: var(--light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.visibility-preview p {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
}

.preview-signature {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.preview-card {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 2px solid var(--grey-light);
  background-color: white;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  opacity: 0.5;
  transition: all 0.3s;
}

.preview-card.active {
  opacity: 1;
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.preview-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--grey-light);
  border-radius: 50%;
}

.preview-content {
  flex: 1;
}

.preview-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.preview-email {
  font-size: var(--font-size-xs);
  color: var(--grey-dark);
}

@media (max-width: 768px) {
  .preview-signature {
    flex-direction: column;
  }
}
</style> 