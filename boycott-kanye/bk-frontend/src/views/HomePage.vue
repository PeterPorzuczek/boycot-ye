<template>
  <div class="home-page">
    <div class="hero-section">
      <h1>Stand Against Hate</h1>
      <p class="description">Join us in publicly condemning Kanye West's antisemitic and Nazi views by signing this petition.</p>
      <div class="cta-button">
        <router-link to="/sign" class="sign-button">Sign the petition</router-link>
      </div>
    </div>
    
    <div class="counter-section">
      <div class="signature-count">
        <span class="count">{{ consentingSignaturesCount }}</span>
        <span class="label">signatures collected</span>
      </div>
    </div>
    
    <div class="signatures-section">
      <h2>Recent signatures</h2>
      <div class="signatures-list">
        <p v-if="isLoading">Loading...</p>
        <p v-else-if="error" class="error-message">{{ error }}</p>
        <div v-else-if="signatures.length === 0" class="no-signatures">
          <p>No signatures yet. Be the first to sign!</p>
        </div>
        <div v-else class="signatures-grid">
          <div v-for="signature in signatures" :key="signature.id" class="signature-item">
            <div class="signature-name">
              {{ signature.expand && signature.expand.user && (signature.public_display || signature.publicDisplay) ? signature.expand.user.name : 'Anonymous' }}
            </div>
            <div v-if="(signature.public_display || signature.publicDisplay) && signature.expand && signature.expand.user && signature.expand.user.email" class="signature-email">
              {{ maskEmail(signature.expand.user.email) }}
            </div>
            <div class="signature-date">
              {{ formatDate(signature.created) }}
            </div>
          </div>
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
      // Count only signatures that have agreed to the petition
      return this.signatures.filter(signature => 
        (signature.agree_checkbox === true) || (signature.agreeCheckbox === true)
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
    
    maskEmail(email) {
      if (!email) return '';
      const [local, domain] = email.split('@');
      const firstChar = local.charAt(0);
      const maskedLocal = firstChar + '*'.repeat(Math.min(local.length - 1, 3));
      const domainParts = domain.split('.');
      const tld = domainParts.pop();
      const domainName = domainParts.join('.');
      const firstDomainChar = domainName.charAt(0);
      const maskedDomain = firstDomainChar + '*'.repeat(Math.min(domainName.length - 1, 3));
      return `${maskedLocal}@${maskedDomain}.${tld}`;
    },
    
    formatDate(date) {
      if (!date) return '';
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
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

.signatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.signature-item {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.signature-name {
  font-weight: bold;
}

.signature-email {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.signature-date {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.no-signatures {
  padding: 2rem;
  color: #666;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  padding: 0.75rem;
  border-radius: 4px;
}
</style> 