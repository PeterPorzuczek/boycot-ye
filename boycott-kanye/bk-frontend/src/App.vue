<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1 class="site-title">{{ t('header.title') }}</h1>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">{{ t('header.home') }}</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link">{{ t('header.profile') }}</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link">{{ t('header.logout') }}</a>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">{{ t('header.login') }}</router-link>
            <router-link to="/register" class="nav-link">{{ t('header.register') }}</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Boycott Kanye</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useTranslation } from './composables/useTranslation';
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const { t } = useTranslation();
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
      // Implementation of logout should be added to useAuth hook
      localStorage.removeItem('token');
      // Reload page to refresh auth state
      router.push('/login');
      window.location.reload();
    };

    return {
      t,
      isLoggedIn,
      handleLogout
    };
  }
}
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background-color: #f4f4f4;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header styles */
.app-header {
  background-color: #333;
  color: white;
  padding: 1rem 0;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.site-title {
  font-size: 1.5rem;
  margin: 0;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ddd;
}

/* Main content styles */
.app-content {
  min-height: calc(100vh - 120px);
  padding: 2rem 0;
}

/* Footer styles */
.app-footer {
  background-color: #333;
  color: white;
  padding: 1rem 0;
  text-align: center;
}

/* Light theme variables */
:root {
  --background-color: #f4f4f4;
  --text-color: #333;
  --card-background: #fff;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Dark theme can be added with CSS variables */
</style>
