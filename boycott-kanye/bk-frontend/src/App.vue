<template>
  <div id="app">
    <app-header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <app-footer />
    <mobile-bottom-nav />
    <router-link 
      v-if="shouldShowSignButton" 
      to="/sign" 
      class="mobile-fab">
      ✒️
    </router-link>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import MobileBottomNav from './components/MobileBottomNav.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './composables/useAuth';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    MobileBottomNav
  },
  setup() {
    const route = useRoute();
    const { isLoggedIn } = useAuth();
    
    // Show floating action button only on certain routes and when logged in
    const shouldShowSignButton = computed(() => {
      const allowedRoutes = ['home'];
      const isCurrentRouteAllowed = route.name && allowedRoutes.includes(route.name);
      const isMobileView = window.innerWidth <= 767;
      
      return isLoggedIn.value && isCurrentRouteAllowed && isMobileView;
    });
    
    // Track window width changes
    const windowWidth = ref(window.innerWidth);
    
    // Handle window resize without causing infinite recursion
    const handleResize = () => {
      windowWidth.value = window.innerWidth;
    };
    
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      shouldShowSignButton
    };
  }
}
</script>

<style>
/* Import your base CSS */
@import './assets/styles/variables.css';
@import './assets/styles/main.css';
@import './assets/styles/mobile.css';

#app {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--primary);
  background-color: var(--background);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  padding-bottom: 0;
}

/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Viewport height fix for mobile browsers */
@media (max-width: 767px) {
  .main-content {
    min-height: calc(100vh - 130px); /* Account for header and bottom nav */
    padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px)); /* Account for bottom nav + safe area */
  }
  
  /* Add bottom padding when bottom nav is present */
  body {
    padding-bottom: env(safe-area-inset-bottom, 0px);
    overflow-x: hidden; /* Prevent horizontal scrolling */
    margin: 0;
    width: 100%;
  }
  
  /* Removed fixed position from html/body as it can cause issues */
  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
}
</style>
