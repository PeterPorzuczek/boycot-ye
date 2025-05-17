// Mock dependencies before import
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })),
  defaults: { headers: { common: {} } }
}));

// Mock Vue components
jest.mock('@/views/HomePage.vue', () => ({ name: 'HomePage' }));
jest.mock('@/views/SignPage.vue', () => ({ name: 'SignPage' }));
jest.mock('@/views/LoginPage.vue', () => ({ name: 'LoginPage' }));
jest.mock('@/views/RegisterPage.vue', () => ({ name: 'RegisterPage' }));
jest.mock('@/views/ThankYouPage.vue', () => ({ name: 'ThankYouPage' }));
jest.mock('@/views/ProfilePage.vue', () => ({ name: 'ProfilePage' }));
jest.mock('@/views/NotFoundPage.vue', () => ({ name: 'NotFoundPage' }));

// Import after mocking
import router from '@/router';

describe('Router', () => {
  // Test route definitions
  test('router contains expected routes', () => {
    const routes = router.options.routes;
    const routeNames = routes.map(route => route.name);
    
    expect(routeNames).toContain('Home');
    expect(routeNames).toContain('Sign');
    expect(routeNames).toContain('Login');
    expect(routeNames).toContain('Register');
    expect(routeNames).toContain('Profile');
  });

  // Test route paths
  test('routes have correct paths', () => {
    const routes = router.options.routes;
    
    const homeRoute = routes.find(route => route.name === 'Home');
    expect(homeRoute.path).toBe('/');
    
    const signRoute = routes.find(route => route.name === 'Sign');
    expect(signRoute.path).toBe('/sign');
    
    const profileRoute = routes.find(route => route.name === 'Profile');
    expect(profileRoute.path).toBe('/profile');
  });

  // Test auth requirements
  test('protected routes require authentication', () => {
    const routes = router.options.routes;
    
    const signRoute = routes.find(route => route.name === 'Sign');
    expect(signRoute.meta.requiresAuth).toBe(true);
    
    const profileRoute = routes.find(route => route.name === 'Profile');
    expect(profileRoute.meta.requiresAuth).toBe(true);
    
    const loginRoute = routes.find(route => route.name === 'Login');
    expect(loginRoute.meta).toBeFalsy();
  });
}); 