import { createRouter, createWebHistory } from 'vue-router';

// Lazy load dla komponentów
const HomePage = () => import('../views/HomePage.vue');
const SignPage = () => import('../views/SignPage.vue');
const LoginPage = () => import('../views/LoginPage.vue');
const RegisterPage = () => import('../views/RegisterPage.vue');
const ThankYouPage = () => import('../views/ThankYouPage.vue');
const ProfilePage = () => import('../views/ProfilePage.vue');
const NotFoundPage = () => import('../views/NotFoundPage.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/sign',
    name: 'Sign',
    component: SignPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/thank-you',
    name: 'ThankYou',
    component: ThankYouPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Nawigacja guard dla ścieżek wymagających autoryzacji
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    // Zapisz ścieżkę docelową, aby przekierować po zalogowaniu
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router; 