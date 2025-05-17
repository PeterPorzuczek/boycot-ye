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
          </div>
          <div class="hero-visual">
            <div class="quote-box">
              <p class="quote-text">{{ $t('homePage.quote.text') }}</p>
              <p class="quote-author">{{ $t('homePage.quote.author') }}</p>
            </div>
            <div class="album-reference">RECLAIM <span>THE</span> LEGACY</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="signatures" class="signatures-section">
      <div class="container">
        <div class="cta-banner">
          <div class="cta-content">
            <h2 class="cta-title">ADD YOUR VOICE</h2>
            <p class="cta-text">Join <span class="highlight">{{ consentingSignaturesCount }}</span> others in standing against hate and discrimination</p>
            <div class="cta-counter">
              <span class="count">{{ consentingSignaturesCount }}</span>
              <span class="label">{{ $t('homePage.hero.counterLabel') }}</span>
            </div>
          </div>
          <router-link to="/sign" class="cta-button btn btn-mbdtf">{{ $t('homePage.hero.signButton') }}</router-link>
        </div>
      
        <h2 class="section-title text-ye">{{ $t('homePage.signatures.title') }}</h2>
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
          <router-link to="/sign" class="btn btn-pablo">{{ $t('homePage.signatures.addVoiceButton') }}</router-link>
        </div>

        <div class="pablo-banner">
          <div class="pablo-text">I FEEL LIKE WE'RE <span>RECLAIMING</span> HIS MUSIC</div>
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

.hero-section::before {
  content: 'PETITION';
  position: absolute;
  top: 5%;
  right: -5%;
  font-size: calc(var(--font-size-jumbo) * 3);
  font-weight: 800;
  opacity: 0.03;
  transform: rotate(-15deg);
  color: var(--primary);
  z-index: 0;
  letter-spacing: -5px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  position: relative;
}

.hero-text::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 5px;
  background: var(--gradient-primary);
  top: -20px;
  left: 0;
}

.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-size: var(--font-size-jumbo);
  line-height: 1;
  font-weight: 900;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: -2px;
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
  height: 12px;
  background-color: var(--secondary);
  bottom: 8px;
  left: -5%;
  z-index: -1;
  opacity: 0.2;
}

.hero-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  line-height: 1.5;
  color: var(--grey-dark);
  position: relative;
  padding-left: var(--spacing-md);
  border-left: 3px solid var(--secondary);
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
  position: relative;
  overflow: hidden;
  background: var(--light);
}

.counter-badge::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 3px;
  background: var(--gradient-primary);
  bottom: 0;
  left: -25%;
}

.counter-badge .count {
  font-size: var(--font-size-xxl);
  font-weight: 800;
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
  flex-direction: column;
  gap: var(--spacing-xl);
  justify-content: center;
  align-items: center;
  position: relative;
}

.album-reference {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: calc(var(--font-size-xl) * 1.5);
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: -2px;
  transform: rotate(-5deg);
  text-align: center;
  line-height: 0.9;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  background-color: var(--accent-3);
  box-shadow: var(--shadow-md);
}

.album-reference span {
  display: block;
  font-size: 0.5em;
  letter-spacing: 5px;
  margin: var(--spacing-xs) 0;
  color: var(--secondary);
}

.album-reference::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%23F7C54820' stroke-width='1'/%3E%3C/svg%3E");
  z-index: -1;
}

.quote-box {
  background: var(--gradient-dark);
  color: var(--light);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  position: relative;
  max-width: 400px;
  transform: rotate(-2deg);
  box-shadow: var(--shadow-lg);
  border-left: 5px solid var(--secondary);
}

.quote-box::before {
  content: '"';
  position: absolute;
  top: -40px;
  left: 20px;
  font-size: 150px;
  color: var(--secondary);
  opacity: 0.3;
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
  position: relative;
}

.quote-author::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 2px;
  background-color: var(--secondary);
  top: 50%;
  left: -50px;
}

/* Signatures Section */
.signatures-section {
  padding: var(--spacing-xxl) 0;
  background-color: white;
  position: relative;
}

.signatures-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--gradient-primary);
  opacity: 0.5;
}

.section-title {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-xl);
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

.container h2.section-title {
  display: block;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
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
  border-left: 5px solid var(--error);
}

.signatures-empty {
  padding: var(--spacing-xl);
  background-color: var(--off-white);
  border-radius: var(--border-radius-md);
  border: 1px dashed var(--grey-mid);
  position: relative;
}

.signatures-empty::before {
  content: '"SIGN NOW"';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: var(--font-size-xs);
  font-weight: 800;
  color: var(--secondary);
  opacity: 0.7;
}

.signatures-empty p {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
  font-weight: 500;
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
  position: relative;
  border: 1px solid var(--grey-light);
}

.signature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--secondary);
}

.signature-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.signature-item:hover::before {
  transform: scaleX(1);
}

.signature-content {
  padding: var(--spacing-lg);
}

.signature-name {
  font-family: 'Montserrat', sans-serif;
  font-size: var(--font-size-lg);
  font-weight: 800;
  margin-bottom: var(--spacing-xs);
  color: var(--primary);
  position: relative;
  display: inline-block;
  letter-spacing: -0.5px;
}

.signature-name::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: var(--secondary);
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.signature-item:hover .signature-name::after {
  transform: scaleX(1);
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
  font-style: italic;
}

.signatures-cta {
  text-align: center;
  margin-top: var(--spacing-xl);
  position: relative;
  margin-bottom: var(--spacing-xxl);
}

.signatures-cta::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 1px;
  background: var(--gradient-primary);
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

/* Pablo-style banner */
.pablo-banner {
  margin: var(--spacing-xxl) auto;
  padding: var(--spacing-xl);
  background: var(--gradient-pablo);
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-md);
}

.pablo-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%23F7C54820' stroke-width='1'/%3E%3C/svg%3E");
  z-index: 0;
}

.pablo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: var(--font-size-xl);
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: -1px;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.pablo-text span {
  color: var(--secondary);
  position: relative;
  display: inline-block;
}

/* New CTA Banner */
.cta-banner {
  margin: 0 auto var(--spacing-xxl);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--gradient-dark);
  border-radius: var(--border-radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border-left: 5px solid var(--secondary);
}

.cta-banner::before {
  content: 'SIGN NOW';
  position: absolute;
  right: -20px;
  top: -30px;
  font-size: calc(var(--font-size-jumbo) * 1.5);
  font-weight: 800;
  opacity: 0.05;
  transform: rotate(-5deg);
  color: var(--light);
  letter-spacing: -5px;
  z-index: 0;
}

.cta-content {
  color: var(--light);
  position: relative;
  z-index: 1;
}

.cta-title {
  font-family: 'Montserrat', sans-serif;
  font-size: var(--font-size-xxl);
  font-weight: 900;
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
}

.cta-title::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 4px;
  background: var(--gradient-primary);
  bottom: -6px;
  left: 0;
}

.cta-text {
  font-size: var(--font-size-lg);
  max-width: 500px;
  margin-bottom: var(--spacing-md);
}

.highlight {
  color: var(--secondary);
  font-weight: 700;
}

.cta-counter {
  display: inline-flex;
  flex-direction: column;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  position: relative;
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.cta-counter::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 3px;
  background: var(--gradient-primary);
  bottom: 0;
  left: -25%;
}

.cta-counter .count {
  font-size: var(--font-size-xxl);
  font-weight: 800;
  color: var(--light);
  line-height: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-counter .label {
  font-size: var(--font-size-sm);
  color: var(--grey-light);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  font-weight: 700;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

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
  
  .hero-section::before {
    font-size: calc(var(--font-size-jumbo) * 1.5);
  }
  
  .cta-banner {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .cta-title::after {
    left: 25%;
    width: 50%;
  }
  
  .cta-text {
    margin-bottom: var(--spacing-lg);
  }
  
  .cta-counter {
    margin: 0 auto var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-xl);
  }
  
  .cta-button {
    width: 100%;
  }
  
  .album-reference {
    font-size: var(--font-size-xl);
  }
  
  .pablo-text {
    font-size: var(--font-size-md);
  }
}
</style> 