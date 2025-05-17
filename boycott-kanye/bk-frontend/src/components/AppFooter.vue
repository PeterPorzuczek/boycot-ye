<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <router-link to="/" class="logo">
            <span class="logo-text">BOYCOTT <span class="logo-accent">YE</span></span>
          </router-link>
          <div class="footer-tagline">United Against Hate</div>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>{{ $t('footer.navigation') }}</h4>
            <ul>
              <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
              <li><router-link to="/sign">{{ $t('nav.sign') }}</router-link></li>
              <li><router-link to="/about">{{ $t('nav.about') }}</router-link></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>{{ $t('footer.legal') }}</h4>
            <ul>
              <li><router-link to="/privacy">{{ $t('footer.privacy') }}</router-link></li>
              <li><router-link to="/terms">{{ $t('footer.terms') }}</router-link></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>{{ $t('footer.connect') }}</h4>
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Boycott Ye. {{ $t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background-color: var(--primary-dark);
  color: var(--light);
  padding: var(--spacing-xl) 0 var(--spacing-md);
  margin-top: var(--spacing-xxl);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  flex: 1;
  min-width: 200px;
}

.logo {
  text-decoration: none;
  display: inline-block;
  margin-bottom: var(--spacing-sm);
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: var(--font-size-md);
  color: white;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.logo-accent {
  color: var(--accent);
  position: relative;
}

.footer-tagline {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-top: var(--spacing-xs);
}

.footer-links {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
}

.link-group {
  flex: 1;
  min-width: 150px;
}

.link-group h4 {
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-md);
  color: var(--accent);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: var(--spacing-sm);
}

.link-group a {
  color: var(--light);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  font-size: var(--font-size-sm);
}

.link-group a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.social-link {
  color: var(--light);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  font-size: var(--font-size-sm);
}

.social-link:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-bottom {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

@media (max-width: 767px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .footer-links {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}
</style> 