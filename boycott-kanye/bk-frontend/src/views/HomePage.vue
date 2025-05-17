<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">{{ $t('homePage.hero.title').split(' ')[0] }} <span>{{ $t('homePage.hero.title').split(' ')[1] }}</span> {{ $t('homePage.hero.title').split(' ')[2] }}</h1>
            <p class="hero-description">{{ $t('homePage.hero.description') }}</p>
            <div class="cta-group">
              <router-link to="/sign" class="btn btn-primary">{{ $t('homePage.hero.signButton') }}</router-link>
              <a href="#signatures" class="btn btn-secondary">{{ $t('homePage.hero.viewButton') }}</a>
            </div>
            <div class="counter-badge">
              <span class="count">{{ consentingSignaturesCount }}</span>
              <span class="label">{{ $t('homePage.hero.counterLabel') }}</span>
            </div>
          </div>
          <div class="hero-visual">
            <div class="quote-box">
              <p class="quote-text">{{ $t('homePage.quote.text') }}</p>
              <p class="quote-author">{{ $t('homePage.quote.author') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="signatures" class="signatures-section">
      <div class="container">
        <h2 class="section-title">{{ $t('homePage.signatures.title') }}</h2>
        <div class="signatures-content">
          <div v-if="isLoading" class="signatures-loading">
            <div class="loader"></div>
            <p>{{ $t('homePage.signatures.loading') }}</p>
          </div>
          
          <div v-else-if="error" class="signatures-error">
            <p>{{ error }}</p>
          </div>
          
          <div v-else-if="signatures.length === 0" class="signatures-empty">
            <p>{{ $t('homePage.signatures.empty') }}</p>
            <router-link to="/sign" class="btn btn-primary">{{ $t('homePage.signatures.signNowButton') }}</router-link>
          </div>
          
          <div v-else class="signatures-grid">
            <div v-for="signature in signatures" :key="signature.id" class="signature-item">
              <div class="signature-content">
                <div class="signature-name">
                  {{ signature.public_display ? signature.full_name : $t('homePage.signatures.anonymous') }}
                </div>
                <div v-if="signature.public_display" class="signature-email">
                  {{ signature.email }}
                </div>
                <div class="signature-date">
                  {{ formatDate(signature.created) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="signatures-cta">
          <router-link to="/sign" class="btn btn-primary">{{ $t('homePage.signatures.addVoiceButton') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      signatures: [],
      isLoading: true,
      error: null
    }
  },
  computed: {
    consentingSignaturesCount() {
      return this.signatures.filter(signature => 
        (signature.agree_checkbox === true)
      ).length;
    }
  },
  created() {
    this.fetchSignatures();
  },
  methods: {
    async fetchSignatures() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get('http://localhost:3000/api/signatures/all');
        this.signatures = response.data;
      } catch (err) {
        console.error('Error fetching signatures:', err);
        this.error = 'Failed to load signatures';
      } finally {
        this.isLoading = false;
      }
    },
    
    formatDate(date) {
      if (!date) return '';
      
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          return date;
        }
        return dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      } catch (err) {
        console.error('Error parsing date:', err);
        return date;
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  padding: var(--spacing-xxl) 0;
  background-color: var(--light);
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
}

.hero-text {
  position: relative;
}

.hero-title {
  font-size: var(--font-size-jumbo);
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: -1px;
  position: relative;
}

.hero-title span {
  color: var(--secondary);
  position: relative;
  display: inline-block;
}

.hero-title span::after {
  content: '';
  position: absolute;
  width: 110%;
  height: 8px;
  background-color: var(--secondary);
  bottom: 8px;
  left: -5%;
  z-index: -1;
  opacity: 0.3;
}

.hero-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  line-height: 1.5;
  color: var(--grey-dark);
}

.cta-group {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.counter-badge {
  display: inline-flex;
  flex-direction: column;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--accent);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-lg);
}

.counter-badge .count {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.counter-badge .label {
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.quote-box {
  background-color: var(--primary);
  color: var(--light);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  position: relative;
  max-width: 400px;
  transform: rotate(-2deg);
  box-shadow: var(--shadow-lg);
}

.quote-box::before {
  content: '"';
  position: absolute;
  top: -30px;
  left: 20px;
  font-size: 120px;
  color: var(--secondary);
  opacity: 0.5;
  font-family: Georgia, serif;
}

.quote-text {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
  position: relative;
  z-index: 1;
}

.quote-author {
  font-style: italic;
  color: var(--grey-mid);
  text-align: right;
}

/* Signatures Section */
.signatures-section {
  padding: var(--spacing-xxl) 0;
  background-color: white;
}

.section-title {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-xl);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background-color: var(--secondary);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.signatures-content {
  margin-bottom: var(--spacing-xl);
}

.signatures-loading,
.signatures-error,
.signatures-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--grey-light);
  border-radius: 50%;
  border-top-color: var(--secondary);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.signatures-error {
  color: var(--error);
  background-color: rgba(255, 58, 94, 0.1);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
}

.signatures-empty {
  padding: var(--spacing-xl);
  background-color: var(--grey-light);
  border-radius: var(--border-radius-md);
}

.signatures-empty p {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.signatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.signature-item {
  background-color: var(--light);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.signature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.signature-content {
  padding: var(--spacing-lg);
}

.signature-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--primary);
}

.signature-email {
  font-size: var(--font-size-sm);
  color: var(--grey-dark);
  margin-bottom: var(--spacing-xs);
}

.signature-date {
  font-size: var(--font-size-xs);
  color: var(--grey-mid);
  margin-top: var(--spacing-sm);
}

.signatures-cta {
  text-align: center;
  margin-top: var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
  }
  
  .hero-visual {
    order: -1;
    margin-bottom: var(--spacing-xl);
  }
  
  .hero-title {
    font-size: var(--font-size-xxl);
  }
  
  .hero-description {
    font-size: var(--font-size-md);
  }
  
  .cta-group {
    flex-direction: column;
  }
  
  .signatures-grid {
    grid-template-columns: 1fr;
  }
}
</style> 