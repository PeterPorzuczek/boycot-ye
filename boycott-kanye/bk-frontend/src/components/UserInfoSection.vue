<template>
  <div class="user-info-section">
    <div v-if="user && user.name && user.email" class="user-info-grid">
      <div class="info-row">
        <div class="info-label">{{ $t('signForm.userInfo.nameLabel') }}</div>
        <div class="info-value">{{ user.name }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">{{ $t('signForm.userInfo.emailLabel') }}</div>
        <div class="info-value">{{ user.email }}</div>
      </div>
    </div>
    <div v-else class="user-info-error">
      <div class="error-icon">!</div>
      <div class="error-content">
        <p>{{ $t('signForm.userInfo.error') }}</p>
        <p>{{ $t('signForm.userInfo.errorHelp') }}</p>
      </div>
    </div>
    <div class="info-note">
      <small>{{ $t('signForm.userInfo.note') }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfoSection',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>
.user-info-section {
  margin-bottom: var(--spacing-md);
}

.user-info-grid {
  display: grid;
  gap: var(--spacing-sm);
}

.info-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.info-label {
  width: 100px;
  font-weight: 600;
  color: var(--grey-dark);
  flex-shrink: 0;
}

.info-value {
  font-weight: 400;
  color: var(--primary);
  background-color: rgba(255, 255, 255, 0.7);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  border-left: 2px solid var(--accent);
}

.user-info-error {
  padding: var(--spacing-md);
  background-color: rgba(255, 58, 94, 0.1);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: flex-start;
}

.error-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--error);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.error-content p {
  margin-bottom: var(--spacing-sm);
  color: var(--error);
  line-height: 1.4;
}

.info-note {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--grey-mid);
  line-height: 1.5;
}
</style> 