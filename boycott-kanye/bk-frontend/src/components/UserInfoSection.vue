<template>
  <div class="user-info-section">
    <h3>{{ $t('sign.yourInfo') }}</h3>
    <div v-if="user && user.name && user.email">
      <div class="info-row">
        <span class="label">{{ $t('sign.nameLabel') }}:</span>
        <span class="value">{{ user.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">{{ $t('sign.emailLabel') }}:</span>
        <span class="value">{{ user.email }}</span>
      </div>
    </div>
    <div v-else class="error-info">
      <p>User information is incomplete. This could be due to a login issue.</p>
      <p>Please try logging out and logging in again.</p>
    </div>
    <div class="info-note">
      <small>{{ $t('sign.infoNote') }}</small>
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
  mounted() {
    // Log received user data for debugging
    console.log('UserInfoSection received user:', this.user);
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

.error-info {
  color: #721c24;
  background-color: #f8d7da;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style> 