// Mock axios before import
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  
  return {
    create: jest.fn(() => mockAxiosInstance),
    defaults: {
      headers: { common: {} }
    },
    mockAxiosInstance // Export the instance to access in tests
  };
});

// Import after mocking
import { signatureApi } from '@/api/signatures';
import axios from 'axios';

describe('Signature API', () => {
  let mockAxiosInstance;
  
  beforeEach(() => {
    // Get the mocked axios instance
    mockAxiosInstance = axios.mockAxiosInstance;
    
    // Reset mock data
    jest.clearAllMocks();
  });

  test('getAllSignatures calls the correct endpoint', () => {
    // Setup mock
    mockAxiosInstance.get.mockResolvedValue({ data: [] });
    
    // Call the function
    signatureApi.getAllSignatures();
    
    // Check if axios was called with correct URL
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/signatures/all');
  });

  test('getCurrentUserSignature calls the correct endpoint', () => {
    // Setup mock
    mockAxiosInstance.get.mockResolvedValue({ data: { id: '123' } });
    
    // Call the function
    signatureApi.getCurrentUserSignature();
    
    // Check if axios was called with correct URL
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/signatures/me');
  });

  test('createSignature sends data to the correct endpoint', () => {
    // Setup mock
    mockAxiosInstance.post.mockResolvedValue({ data: { id: '123' } });
    
    // Test data
    const signatureData = {
      publicDisplay: true
    };
    
    // Call the function
    signatureApi.createSignature(signatureData);
    
    // Check if axios was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/signatures', signatureData);
  });

  test('deleteSignature calls correct endpoint with ID', () => {
    // Setup mock
    mockAxiosInstance.delete.mockResolvedValue({ data: { success: true } });
    
    // Call the function
    const id = '123';
    signatureApi.deleteSignature(id);
    
    // Check if axios was called correctly
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/signatures/123');
  });
}); 