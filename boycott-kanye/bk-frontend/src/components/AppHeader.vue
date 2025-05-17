<template>
  <header class="app-header">
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">BOYCOTT <span class="logo-accent">YE</span></span>
        </router-link>
      </div>
      
      <button @click="toggleMenu" class="menu-toggle">
        <span class="menu-icon" :class="{ 'open': menuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      
      <nav class="nav-links" :class="{ 'mobile-menu-open': menuOpen }">
        <!-- Always visible links -->
        <router-link to="/" class="nav-link" @click="closeMenu">
          {{ $t('nav.home') }}
        </router-link>
        
        <!-- Visible only when not logged in -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link" @click="closeMenu">
            {{ $t('nav.login') }}
          </router-link>
          <router-link to="/register" class="nav-link btn-primary-outline" @click="closeMenu">
            {{ $t('nav.register') }}
          </router-link>
        </template>
        
        <!-- Visible only when logged in -->
        <template v-else>
          <router-link to="/sign" class="nav-link" @click="closeMenu">
            {{ $t('nav.sign') }}
          </router-link>
          <router-link to="/profile" class="nav-link profile-link" @click="closeMenu">
            <span class="profile-icon">👤</span>
            {{ $t('nav.profile') }}
          </router-link>
          <button @click="handleLogout" class="nav-link btn-logout">
            {{ $t('nav.logout') }}
          </button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const menuOpen = ref(false);
    
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
      if (menuOpen.value) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    };
    
    const closeMenu = () => {
      if (menuOpen.value) {
        menuOpen.value = false;
        document.body.classList.remove('menu-open');
      }
    };
    
    const handleLogout = () => {
      localStorage.removeItem('token');
      closeMenu();
      router.push('/');
      window.location.reload(); // Force refresh to update auth state
    };
    
    return {
      isLoggedIn,
      menuOpen,
      toggleMenu,
      closeMenu,
      handleLogout
    };
  }
}
</script>

<style scoped>
.app-header {
  background-color: var(--light);
  border-bottom: 1px solid var(--grey-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.app-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
}

.logo-container {
  flex-shrink: 0;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: var(--font-size-lg);
  color: var(--primary);
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.logo-accent {
  color: var(--secondary);
  position: relative;
}

.logo-accent::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--secondary);
  opacity: 0.3;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-link {
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: var(--font-size-md);
  transition: color 0.2s;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.nav-link:hover {
  color: var(--secondary);
}

.btn-primary-outline {
  border: 2px solid var(--accent);
  border-radius: var(--border-radius-md);
  color: var(--accent);
  padding: var(--spacing-xs) var(--spacing-md);
  transition: all 0.2s;
}

.btn-primary-outline:hover {
  background-color: var(--accent);
  color: var(--primary-dark);
}

.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary);
  font-weight: 600;
  font-size: var(--font-size-md);
  transition: opacity 0.2s;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.btn-logout:hover {
  opacity: 0.8;
}

.profile-link {
  position: relative;
  font-weight: 700;
}

.profile-icon {
  margin-right: 5px;
  position: relative;
  top: 1px;
}

/* Mobile menu styles */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  width: 30px;
  height: 30px;
  z-index: 1001;
}

.menu-icon {
  position: relative;
  width: 100%;
  height: 100%;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: var(--primary);
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
}

.menu-icon span:nth-child(1) {
  top: 5px;
}

.menu-icon span:nth-child(2) {
  top: 14px;
}

.menu-icon span:nth-child(3) {
  top: 23px;
}

.menu-icon.open span:nth-child(1) {
  top: 14px;
  transform: rotate(135deg);
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.menu-icon.open span:nth-child(3) {
  top: 14px;
  transform: rotate(-135deg);
}

/* Mobile styles */
@media (max-width: 767px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 61px; /* Header height */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--light);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: var(--spacing-xl) var(--spacing-lg);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }
  
  .nav-links.mobile-menu-open {
    transform: translateX(0);
  }
  
  .nav-link {
    padding: var(--spacing-md);
    width: 100%;
    text-align: center;
    border-bottom: 1px solid var(--grey-light);
  }
  
  .btn-primary-outline {
    width: 100%;
    margin: var(--spacing-sm) 0;
  }
  
  body.menu-open {
    overflow: hidden;
  }
}
</style> 