import { AuthMiddleware } from './auth.middleware';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

// Mock PocketBase zamiast importowania rzeczywistego modułu
jest.mock('pocketbase', () => {
  return class MockPocketBase {
    constructor() {
      this.authStore = {
        clear: jest.fn(),
        save: jest.fn(),
      };
      this.collection = jest.fn(() => ({
        authRefresh: jest.fn(),
      }));
    }
  };
});

// Suppress logger output during tests to keep test results clean
jest.spyOn(Logger, 'debug').mockImplementation(() => {});
jest.spyOn(Logger, 'log').mockImplementation(() => {});
jest.spyOn(Logger, 'warn').mockImplementation(() => {});
jest.spyOn(Logger, 'error').mockImplementation(() => {});

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let mockConfigService: ConfigService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let mockPocketBaseInstance: any;

  beforeEach(() => {
    // Setup mock PocketBase instance
    mockPocketBaseInstance = {
      authStore: {
        clear: jest.fn(),
        save: jest.fn(),
        token: '',
        model: null,
        isValid: false,
      },
      collection: jest.fn().mockReturnValue({
        authRefresh: jest.fn(),
      }),
    };

    // Setup mock ConfigService
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'POCKETBASE_URL') {
          return 'http://localhost:8090';
        }
        return null;
      }),
    } as unknown as ConfigService;

    middleware = new AuthMiddleware(mockConfigService);

    // Replace the actual PocketBase instance in the middleware with our mock
    (middleware as any).pb = mockPocketBaseInstance;

    // Setup mock Express objects
    mockRequest = {
      headers: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Constructor already initializes PocketBase
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should pass request without auth header', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it('should validate token and set user data on valid auth header', async () => {
    const token = 'valid-token';
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    // Mock a successful auth response
    const mockAuthResponse = {
      record: { id: '123', email: 'test@example.com', name: 'Test User' },
      token: token,
    };
    mockPocketBaseInstance
      .collection('users')
      .authRefresh.mockResolvedValue(mockAuthResponse);

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user).toHaveProperty('id');
  });

  it('should handle auth header without Bearer prefix', async () => {
    mockRequest.headers = {
      authorization: 'invalid-format',
    };

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it('should handle error during token validation', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    // Force an error to occur during validation
    const pb = (middleware as any).pb;
    jest
      .spyOn(pb.collection('users'), 'authRefresh')
      .mockRejectedValue(new Error('Invalid token'));

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  describe('when no token is provided', () => {
    it('should pass request through without user data', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });
  });

  describe('when token is provided but invalid', () => {
    it('should not set user data and call next', async () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';

      // Mock authRefresh to throw an error for invalid token
      const pb = (middleware as any).pb;
      jest
        .spyOn(pb.collection('users'), 'authRefresh')
        .mockRejectedValue(new Error('Invalid token'));

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });
  });

  describe('when token is provided and valid', () => {
    it('should set user data and call next', async () => {
      mockRequest.headers.authorization = 'Bearer valid-token';

      // Mock a successful auth response
      const mockAuthResponse = {
        record: { id: '123', email: 'test@example.com', name: 'Test User' },
        token: 'valid-token',
      };
      mockPocketBaseInstance
        .collection('users')
        .authRefresh.mockResolvedValue(mockAuthResponse);

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });
  });

  describe('when authRefresh returns data but no record', () => {
    const mockAuthDataNoRecord = { token: 'newToken', meta: {} };

    beforeEach(() => {
      mockRequest.headers = { authorization: 'Bearer validtoken' };
      mockPocketBaseInstance
        .collection('users')
        .authRefresh.mockResolvedValue(mockAuthDataNoRecord);
    });

    it('should set req.user to undefined and call next()', async () => {
      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockPocketBaseInstance.authStore.clear).toHaveBeenCalledTimes(1);
      expect(mockPocketBaseInstance.authStore.save).toHaveBeenCalledWith(
        'validtoken',
        null,
      );
      expect(
        mockPocketBaseInstance.collection('users').authRefresh,
      ).toHaveBeenCalledTimes(1);
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('token extraction logic', () => {
    it('should extract token correctly from Bearer header', async () => {
      mockRequest.headers = { authorization: 'Bearer sometoken123' };
      mockPocketBaseInstance.collection('users').authRefresh.mockResolvedValue({
        record: { id: '1', email: 'a@b.c', name: 'Test' },
        token: 'abc',
      });

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockPocketBaseInstance.authStore.save).toHaveBeenCalledWith(
        'sometoken123',
        null,
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should result in undefined user if token is not Bearer type', async () => {
      mockRequest.headers = { authorization: 'Basic sometoken123' };

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockPocketBaseInstance.authStore.save).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should result in undefined user if authorization header is malformed (no space)', async () => {
      mockRequest.headers = { authorization: 'BearerTokenWithoutSpace' };

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockPocketBaseInstance.authStore.save).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should result in undefined user if authorization header is missing', async () => {
      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockPocketBaseInstance.authStore.save).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
