import { t } from '@/utils/i18n';

// Mock the translations import
jest.mock('@/assets/translations.json', () => ({
  test: {
    hello: 'Hello',
    greeting: 'Hello, {name}!',
    nested: {
      value: 'Nested value'
    }
  }
}));

describe('i18n utility', () => {
  test('returns the correct translation for a simple key', () => {
    expect(t('test.hello')).toBe('Hello');
  });

  test('returns the key if translation does not exist', () => {
    expect(t('test.nonexistent')).toBe('test.nonexistent');
  });

  test('replaces parameters in translations', () => {
    expect(t('test.greeting', { name: 'World' })).toBe('Hello, World!');
  });

  test('handles nested keys correctly', () => {
    expect(t('test.nested.value')).toBe('Nested value');
  });
}); 