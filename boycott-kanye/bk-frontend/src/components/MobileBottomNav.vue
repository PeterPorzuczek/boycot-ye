<template>
  <div class="mobile-bottom-nav" v-if="showBottomNav">
    <!-- Home link (always visible) -->
    <router-link to="/" class="nav-item" exact-active-class="active">
      <div class="nav-icon">🏠</div>
      <div class="nav-label">{{ $t('nav.home') }}</div>
    </router-link>
    
    <!-- Sign petition link (visible only when logged in) -->
    <router-link v-if="isLoggedIn" to="/sign" class="nav-item" active-class="active">
      <div class="nav-icon">✒️</div>
      <div class="nav-label">{{ $t('nav.sign') }}</div>
    </router-link>
    
    <!-- Profile link (visible only when logged in) -->
    <router-link v-if="isLoggedIn" to="/profile" class="nav-item profile-link" active-class="active">
      <div class="nav-icon profile-icon">👤</div>
      <div class="nav-label">{{ $t('nav.profile') }}</div>
    </router-link>
    
    <!-- Logout button (visible only when logged in) -->
    <div v-if="isLoggedIn" class="nav-item" @click="handleLogout">
      <div class="nav-icon">🚪</div>
      <div class="nav-label">{{ $t('nav.logout') }}</div>
    </div>
    
    <!-- Login link (visible only when NOT logged in) -->
    <router-link v-if="!isLoggedIn" to="/login" class="nav-item" active-class="active">
      <div class="nav-icon">🔑</div>
      <div class="nav-label">{{ $t('nav.login') }}</div>
    </router-link>
    
    <!-- Register link (visible only when NOT logged in) -->
    <router-link v-if="!isLoggedIn" to="/register" class="nav-item" active-class="active">
      <div class="nav-icon">✍️</div>
      <div class="nav-label">{{ $t('nav.register') }}</div>
    </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  name: 'MobileBottomNav',
  setup() {
    const { isLoggedIn } = useAuth();
    const isMobile = ref(false);
    const showBottomNav = computed(() => isMobile.value && window.innerWidth <= 767);
    const router = useRouter();
    
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 767;
    };
    
    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });
    
    // Watch for login state changes and force re-render
    watch(isLoggedIn, (newValue) => {
      console.log('Login state changed:', newValue);
    });
    
    const handleLogout = () => {
      localStorage.removeItem('token');
      router.push('/');
      window.location.reload(); // Force refresh to update auth state
    };
    
    return {
      isLoggedIn,
      showBottomNav,
      handleLogout
    };
  }
}
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  width: 100vw;
  margin: 0;
  display: none; /* Hide by default */
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--grey-dark);
  flex: 1;
  height: 100%;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.nav-label {
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 2px;
}

.nav-item.active {
  color: var(--accent);
  position: relative;
}

.profile-link {
  position: relative;
}

.profile-link.active .profile-icon {
  transform: scale(1.2);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 3px 3px 0 0;
}

@media (max-width: 767px) {
  .mobile-bottom-nav {
    display: flex; /* Show only on mobile */
  }
}
</style> 