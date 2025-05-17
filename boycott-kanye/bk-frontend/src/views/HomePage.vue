<template>
  <div class="home-page">
    <div class="hero-section">
      <h1>{{ t('home.title') }}</h1>
      <p class="description">{{ t('home.description') }}</p>
      <div class="cta-button">
        <router-link to="/sign" class="sign-button">{{ t('home.signButton') }}</router-link>
      </div>
    </div>
    
    <div class="counter-section">
      <div class="signature-count">
        <span class="count">0</span>
        <span class="label">{{ t('home.counterText') }}</span>
      </div>
    </div>
    
    <div class="signatures-section">
      <h2>{{ t('home.recentSignatures') }}</h2>
      <div class="signatures-list">
        <p>Loading signatures...</p>
        <!-- Signatures will be loaded here -->
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'HomePage',
  setup() {
    const { t } = useTranslation();
    
    return {
      t
    };
  }
}
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-section {
  text-align: center;
  padding: 2rem 0;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-button {
  margin: 2rem 0;
}

.sign-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;
}

.sign-button:hover {
  background-color: #45a049;
}

.counter-section {
  text-align: center;
  margin: 2rem 0;
}

.signature-count {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.count {
  font-size: 2.5rem;
  font-weight: bold;
  display: block;
}

.label {
  font-size: 1rem;
  color: #666;
}

.signatures-section {
  margin: 3rem 0;
}

.signatures-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.signatures-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
}
</style> 