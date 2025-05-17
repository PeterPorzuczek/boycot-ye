<template>
  <div class="thank-you-page">
    <div class="page-header">
      <h1>{{ t('thankYou.title') }}</h1>
    </div>
    
    <div class="thank-you-content">
      <div class="success-icon">✓</div>
      <p class="thank-you-message">{{ t('thankYou.message') }}</p>
      
      <div class="share-section">
        <h3>{{ t('thankYou.shareTitle') }}</h3>
        <div class="share-buttons">
          <a href="#" class="share-button facebook">Facebook</a>
          <a href="#" class="share-button twitter">Twitter</a>
        </div>
      </div>
      
      <div class="back-home">
        <router-link to="/" class="back-link">{{ t('thankYou.backToHome') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'ThankYouPage',
  setup() {
    const { t } = useTranslation();
    return { t };
  }
}
</script>

<style scoped>
.thank-you-page {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.thank-you-content {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.thank-you-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.share-section {
  margin: 2rem 0;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.share-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.facebook {
  background-color: #3b5998;
}

.twitter {
  background-color: #1da1f2;
}

.back-home {
  margin-top: 2rem;
}

.back-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #0056b3;
}
</style> 