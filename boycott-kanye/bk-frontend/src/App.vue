<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1 class="site-title">Boycott Kanye</h1>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">Home</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/sign" class="nav-link">Sign Petition</router-link>
            <router-link to="/profile" class="nav-link">Profile</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link">Logout</a>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2023 Boycott Kanye</p>
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
    // Initialize login state
    this.updateLoginState();
    
    // Set up a listener for storage events (if token changes in another tab)
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // Clean up listener
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    updateLoginState() {
      this.isLoggedIn = !!localStorage.getItem('token');
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
}

.nav-link:hover {
  color: #ddd;
}

.router-link-active {
  color: #ffc107;
  font-weight: bold;
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
</style>
