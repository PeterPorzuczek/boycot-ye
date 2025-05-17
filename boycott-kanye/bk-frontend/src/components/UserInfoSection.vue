<template>
  <div class="user-info-section">
    <h3>{{ t('sign.yourInfo') }}</h3>
    <div class="info-row">
      <span class="label">{{ t('sign.nameLabel') }}:</span>
      <span class="value">{{ user.name }}</span>
    </div>
    <div class="info-row">
      <span class="label">{{ t('sign.emailLabel') }}:</span>
      <span class="value">{{ user.email }}</span>
    </div>
    <div class="info-note">
      <small>{{ t('sign.infoNote') }}</small>
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'UserInfoSection',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && value.name && value.email;
      }
    }
  },
  setup() {
    const { t } = useTranslation();
    return { t };
  }
}
</script>

<style scoped>
.user-info-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.info-row {
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
  min-width: 150px;
  margin-right: 1rem;
}

.info-note {
  margin-top: 1rem;
  color: #666;
}
</style> 