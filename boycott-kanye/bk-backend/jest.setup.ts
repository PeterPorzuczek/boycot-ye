// Ten plik zostanie uruchomiony przed każdym testem
// Możemy użyć go do globalnych ustawień dla testów

// Wyciszenie logów podczas testów
import { Logger } from '@nestjs/common';

// Mock Logger methods to prevent console clutter during tests
jest.spyOn(Logger, 'debug').mockImplementation(() => {});
jest.spyOn(Logger, 'log').mockImplementation(() => {});
jest.spyOn(Logger, 'warn').mockImplementation(() => {});
jest.spyOn(Logger, 'error').mockImplementation(() => {});

// Moduł PocketBase będzie zawsze dostępny w testach
jest.mock('pocketbase', () => {
  // Klasa mockująca PocketBase
  class MockPocketBase {
    baseUrl = 'http://localhost:8090';
    
    authStore = {
      token: 'test-token',
      clear: jest.fn(),
      save: jest.fn(),
      isValid: true
    };

    collection = jest.fn().mockImplementation((name) => {
      return {
        create: jest.fn().mockImplementation((data) => ({
          id: 'mock-id',
          ...data,
          created: '2023-01-01 12:00:00'
        })),
        getList: jest.fn().mockImplementation(() => ({
          items: []
        })),
        getOne: jest.fn().mockImplementation((id) => ({
          id,
          author_id: 'user123'
        })),
        delete: jest.fn().mockResolvedValue({}),
        authWithPassword: jest.fn().mockImplementation((email, password) => ({
          record: {
            id: 'user123',
            email,
            name: 'Test User'
          },
          token: 'test-token'
        }))
      };
    });

    health = {
      check: jest.fn().mockResolvedValue({ code: 200 })
    };
  }

  return jest.fn().mockImplementation(() => new MockPocketBase());
}); 