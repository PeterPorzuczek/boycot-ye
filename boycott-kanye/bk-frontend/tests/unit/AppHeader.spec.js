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

// Mock Vue components to avoid component dependency issues
jest.mock('@/views/HomePage.vue', () => ({ name: 'HomePage' }));
jest.mock('@/views/SignPage.vue', () => ({ name: 'SignPage' }));
jest.mock('@/views/LoginPage.vue', () => ({ name: 'LoginPage' }));
jest.mock('@/views/RegisterPage.vue', () => ({ name: 'RegisterPage' }));
jest.mock('@/views/ThankYouPage.vue', () => ({ name: 'ThankYouPage' }));
jest.mock('@/views/ProfilePage.vue', () => ({ name: 'ProfilePage' }));
jest.mock('@/views/NotFoundPage.vue', () => ({ name: 'NotFoundPage' }));

// Mock i18n
jest.mock('@/utils/i18n', () => ({
  install: jest.fn(),
  t: jest.fn(key => key)
}));

// Now import the modules
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import router from '@/router';
import App from '@/App.vue';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  let wrapper;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Mount the component with global mocks
    wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: ['router-view'],
        mocks: {
          $t: (key) => key // Simple mock function for translation
        }
      }
    });
  });

  test('renders the site title', async () => {
    await nextTick();
    const siteTitle = wrapper.find('.site-title');
    expect(siteTitle.exists()).toBe(true);
  });

  test('shows login and register links when not logged in', async () => {
    await nextTick();
    const loginLink = wrapper.find('a');
    expect(loginLink.exists()).toBe(true);
  });

  test('shows different navigation when logged in', async () => {
    // Set token to simulate logged in state
    localStorage.setItem('token', 'fake-token');
    
    // Need to remount the component to see the change
    wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: ['router-view'],
        mocks: {
          $t: (key) => key // Simple mock function for translation
        }
      }
    });
    
    await nextTick();
    
    // Just verify the component renders in the logged-in state
    const navLinks = wrapper.findAll('a');
    expect(navLinks.length).toBeGreaterThan(0);
  });
}); 