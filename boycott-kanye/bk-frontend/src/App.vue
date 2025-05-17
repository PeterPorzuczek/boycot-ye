<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <router-link to="/" class="site-title-link">
          <h1 class="site-title">{{ $t('general.siteTitle') }}</h1>
        </router-link>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">{{ $t('navigation.home') }}</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/sign" class="nav-link">{{ $t('navigation.signPetition') }}</router-link>
            <router-link to="/profile" class="nav-link">{{ $t('navigation.profile') }}</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link">{{ $t('navigation.logout') }}</a>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">{{ $t('navigation.login') }}</router-link>
            <router-link to="/register" class="nav-link">{{ $t('navigation.register') }}</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>{{ $t('general.copyright') }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.updateLoginState();
    
    window.addEventListener('storage', this.handleStorageChange);
  },
  mounted() {
    this.updateLoginState();
    
    this.loginCheckInterval = setInterval(() => {
      this.updateLoginState();
    }, 1000);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    clearInterval(this.loginCheckInterval);
  },
  methods: {
    updateLoginState() {
      const hasToken = !!localStorage.getItem('token');
      if (this.isLoggedIn !== hasToken) {
        this.isLoggedIn = hasToken;
      }
    },
    handleStorageChange(event) {
      if (event.key === 'token') {
        this.updateLoginState();
      }
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary: #121212;
  --secondary: #FF3A5E;
  --accent: #3A66FF;
  --light: #F8F8F8;
  --grey-light: #E8E8E8;
  --grey-mid: #B0B0B0;
  --grey-dark: #707070;
  --success: #00C170;
  --error: #FF3A5E;
  --warning: #FF9F1C;
  --gradient-primary: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-xxl: 2rem;
  --font-size-jumbo: 3.5rem;
  --line-height: 1.5;
}

body {
  font-family: 'Jost', sans-serif;
  line-height: var(--line-height);
  background-color: var(--light);
  color: var(--primary);
  font-size: var(--font-size-md);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.app-header {
  background-color: var(--light);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--grey-light);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-title-link {
  text-decoration: none;
  transition: transform 0.2s ease;
}

.site-title-link:hover {
  transform: scale(1.05);
}

.site-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  font-weight: 500;
  text-decoration: none;
  color: var(--primary);
  position: relative;
  padding: var(--spacing-xs) 0;
  text-transform: uppercase;
  font-size: var(--font-size-sm);
  letter-spacing: 0.5px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--secondary);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--secondary);
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active {
  color: var(--secondary);
  font-weight: 600;
}

.router-link-active::after {
  width: 100%;
}

.app-content {
  min-height: calc(100vh - 160px);
  padding: var(--spacing-xxl) 0;
}

.app-footer {
  background-color: var(--primary);
  color: var(--light);
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-md);
  border: none;
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: var(--font-size-md);
}

.btn-primary {
  background-color: var(--secondary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid var(--secondary);
  color: var(--secondary);
}

.btn-secondary:hover {
  background-color: var(--secondary);
  color: white;
  transform: translateY(-2px);
}

input, textarea, select {
  font-family: 'Jost', sans-serif;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--grey-mid);
  font-size: var(--font-size-md);
  width: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(58, 102, 255, 0.1);
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--grey-dark);
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
.mt-3 { margin-top: var(--spacing-md); }
.mt-4 { margin-top: var(--spacing-lg); }
.mt-5 { margin-top: var(--spacing-xl); }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-xs); }
.mb-2 { margin-bottom: var(--spacing-sm); }
.mb-3 { margin-bottom: var(--spacing-md); }
.mb-4 { margin-bottom: var(--spacing-lg); }
.mb-5 { margin-bottom: var(--spacing-xl); }
</style>
