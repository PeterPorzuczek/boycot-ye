import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './utils/i18n';

// Import MobileBottomNav for global registration
import MobileBottomNav from './components/MobileBottomNav.vue';
import AppHeader from './components/AppHeader.vue';

// Create Vue app
const app = createApp(App);

// Register global components
app.component('MobileBottomNav', MobileBottomNav);
app.component('AppHeader', AppHeader);

// Use plugins
app.use(router);
app.use(i18n);

// Mount app
app.mount('#app');
