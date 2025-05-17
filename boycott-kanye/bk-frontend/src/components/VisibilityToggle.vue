<template>
  <div class="visibility-toggle">
    <div class="visibility-info">
      <h3 class="visibility-title">{{ $t('signForm.visibility.title') }}</h3>
      <p>{{ $t('signForm.visibility.description') }}</p>
    </div>
    <label class="toggle-container">
      <div class="toggle-switch">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="slider">
          <span class="slider-text on">ON</span>
          <span class="slider-text off">OFF</span>
        </span>
      </div>
      <span class="toggle-label">
        {{ $t('signForm.visibility.toggle') }}
        <span class="status-label" :class="{ 'status-on': modelValue, 'status-off': !modelValue }">
          {{ modelValue ? 'PUBLIC' : 'PRIVATE' }}
        </span>
      </span>
    </label>
    <div class="visibility-note">
      <small>{{ $t('signForm.visibility.note') }}</small>
    </div>
    <div class="visibility-preview">
      <p class="preview-label">{{ $t('signForm.visibility.preview') }}</p> 
      <div class="preview-signature">
        <div class="preview-card" :class="{ 'active': modelValue }">
          <div class="preview-header">
            <span class="preview-tag">PUBLIC</span>
          </div>
          <div class="preview-icon">👤</div>
          <div class="preview-content">
            <div class="preview-name">{{ $t('signForm.visibility.previewPublic') }}</div>
            <div class="preview-email">{{ $t('signForm.visibility.previewEmail') }}</div>
          </div>
        </div>
        <div class="preview-card" :class="{ 'active': !modelValue }">
          <div class="preview-header">
            <span class="preview-tag">PRIVATE</span>
          </div>
          <div class="preview-icon">🔒</div>
          <div class="preview-content">
            <div class="preview-name">{{ $t('signForm.visibility.previewPrivate') }}</div>
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
  margin-bottom: var(--spacing-xl);
  position: relative;
  border-left: 3px solid var(--accent);
  padding-left: var(--spacing-lg);
}

.visibility-toggle::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -3px;
  width: 30px;
  height: 5px;
  background: var(--gradient-primary);
}

.visibility-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.visibility-info {
  margin-bottom: var(--spacing-lg);
}

.visibility-info p {
  font-size: var(--font-size-md);
  color: var(--grey-dark);
  line-height: 1.5;
}

.toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--off-white);
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
  border: 1px solid var(--grey-light);
}

.toggle-container:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;
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
  background: var(--gradient-dark);
  transition: .4s;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.slider-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 700;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-text.on {
  right: 7px;
  color: white;
  opacity: 0;
}

.slider-text.off {
  left: 7px;
  color: var(--grey-light);
  opacity: 1;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

input:checked + .slider {
  background: var(--gradient-primary);
}

input:checked + .slider .slider-text.on {
  opacity: 1;
}

input:checked + .slider .slider-text.off {
  opacity: 0;
}

input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(58, 102, 255, 0.2);
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.toggle-label {
  font-weight: 600;
  font-size: var(--font-size-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-label {
  font-size: var(--font-size-xs);
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-on {
  background: var(--secondary);
  color: white;
}

.status-off {
  background: var(--grey-dark);
  color: white;
}

.visibility-note {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
  margin-left: calc(60px + var(--spacing-md) + var(--spacing-md));
  position: relative;
  font-style: italic;
}

.visibility-note::before {
  content: '*';
  position: absolute;
  left: -10px;
  color: var(--secondary);
}

.visibility-preview {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--grey-light);
  position: relative;
}

.visibility-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
}

.preview-label {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-signature {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.preview-card {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 2px solid var(--grey-light);
  background-color: var(--off-white);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  opacity: 0.6;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.preview-header {
  position: absolute;
  top: 0;
  right: 0;
}

.preview-tag {
  display: inline-block;
  background: var(--primary);
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  letter-spacing: 0.5px;
}

.preview-card.active {
  opacity: 1;
  border-color: var(--accent);
  background-color: white;
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.preview-card:first-child .preview-tag {
  background: var(--secondary);
}

.preview-card:last-child .preview-tag {
  background: var(--grey-dark);
}

.preview-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--light);
  border-radius: 50%;
  border: 1px solid var(--grey-light);
  transition: all 0.3s;
}

.preview-card.active .preview-icon {
  background: var(--gradient-light);
  box-shadow: var(--shadow-sm);
}

.preview-content {
  flex: 1;
}

.preview-name {
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--primary);
}

.preview-email {
  font-size: var(--font-size-xs);
  color: var(--grey-dark);
}

@media (max-width: 768px) {
  .preview-signature {
    flex-direction: column;
  }
  
  .toggle-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toggle-switch {
    margin-bottom: var(--spacing-sm);
  }
  
  .visibility-note {
    margin-left: 0;
  }
}
</style> 