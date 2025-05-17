import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PocketbaseService } from './pocketbase.service';
import { CreateSignatureDto } from '../signatures/dto/create-signature.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';

// Tworzenie poprawnych mocków dla wszystkich metod używanych w testach
class MockPocketBase {
  authStore = {
    token: 'test-token',
    clear: jest.fn(),
    save: jest.fn(),
    isValid: true,
  };

  collection = jest.fn().mockImplementation((name) => {
    return {
      create: jest.fn().mockImplementation((data) => {
        return {
          id: 'mock-id',
          ...data,
          created: '2023-01-01 12:00:00',
        };
      }),
      getList: jest.fn().mockImplementation(() => {
        if (name === 'signatures') {
          return {
            items: [
              {
                id: 'sig1',
                author_id: 'user1',
                public_display: true,
                expand: {
                  user: {
                    email: 'john.doe@example.com',
                    name: 'John Doe',
                  },
                },
              },
            ],
          };
        }
        return { items: [] };
      }),
      getOne: jest.fn().mockImplementation((id) => {
        return {
          id,
          author_id: 'user123',
        };
      }),
      delete: jest.fn().mockResolvedValue({}),
      authWithPassword: jest.fn().mockImplementation((email, password) => {
        return {
          record: {
            id: 'user123',
            email,
            name: 'Test User',
          },
          token: 'test-token',
        };
      }),
      authRefresh: jest.fn().mockResolvedValue({
        record: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
        },
      }),
    };
  });

  health = {
    check: jest.fn().mockResolvedValue({ code: 200 }),
  };
}

// Mock PocketBase klasy
jest.mock('pocketbase', () => {
  return jest.fn().mockImplementation(() => {
    return new MockPocketBase();
  });
});

// Wyciszenie logów podczas testów
jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

describe('PocketbaseService', () => {
  let service: PocketbaseService;
  let mockPocketBaseInstance: MockPocketBase;

  beforeEach(async () => {
    // Mock ConfigService
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'POCKETBASE_URL') {
          return 'http://localhost:8090';
        }
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PocketbaseService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PocketbaseService>(PocketbaseService);

    // Wywołaj metodę inicjalizacji i upewnij się, że mockPocketBaseInstance jest poprawnie ustawiony
    service.onModuleInit();
    mockPocketBaseInstance = (service as any).pb;

    // Reset all mock implementations before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'Test User',
      };

      // Setup the mock correctly
      const mockCollection = {
        create: jest.fn().mockResolvedValue({
          id: 'mock-id',
          email: registerDto.email,
          name: registerDto.name,
          created: '2023-01-01 12:00:00',
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.register(registerDto);

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: registerDto.password,
        passwordConfirm: registerDto.passwordConfirm,
        name: registerDto.name,
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', registerDto.email);
      expect(result).toHaveProperty('name', registerDto.name);
    });

    it('should handle registration error', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'Test User',
      };

      // Przygotowanie błędu
      const error = new Error('Validation error');
      (error as any).status = 400;
      (error as any).response = {
        data: {
          email: {
            message: 'Email already exists',
          },
        },
      };

      // Setup mock to reject
      const mockCollection = {
        create: jest.fn().mockRejectedValue(error),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      await expect(service.register(registerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Setup the mock correctly
      const mockCollection = {
        authWithPassword: jest.fn().mockResolvedValue({
          record: {
            id: 'user123',
            email: loginDto.email,
            name: 'Test User',
          },
          token: 'test-token',
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.login(loginDto);

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.authWithPassword).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );

      expect(result).toHaveProperty('token', 'test-token');
      expect(result).toHaveProperty('user.id', 'user123');
      expect(result).toHaveProperty('user.email', loginDto.email);
    });

    it('should handle login error', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Przygotowanie błędu
      const error = new Error('Invalid credentials');
      (error as any).status = 400;

      // Setup mock to reject
      const mockCollection = {
        authWithPassword: jest.fn().mockRejectedValue(error),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('getSignatures', () => {
    it('should return public signatures with masked emails', async () => {
      // Mock the maskEmail function properly
      (service as any).maskEmail = jest
        .fn()
        .mockReturnValue('j*****e@example.com');

      // Setup the mock correctly
      const mockCollection = {
        getList: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'sig1',
              author_id: 'user1',
              public_display: true,
              expand: {
                user: {
                  email: 'john.doe@example.com',
                  name: 'John Doe',
                },
              },
            },
          ],
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.getSignatures();

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith(
        'signatures',
      );
      expect(mockCollection.getList).toHaveBeenCalledWith(1, 100, {
        expand: 'user',
      });

      // Weryfikuj rezultat
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('sig1');
      expect((service as any).maskEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
    });

    it('should handle error when fetching signatures', async () => {
      // Przygotowanie błędu
      const error = new Error('Server error');
      (error as any).status = 500;

      // Setup mock to reject
      const mockCollection = {
        getList: jest.fn().mockRejectedValue(error),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      await expect(service.getSignatures()).rejects.toThrow(HttpException);
    });
  });

  describe('createSignature', () => {
    it('should create a signature', async () => {
      const createSignatureDto: CreateSignatureDto = {
        userId: 'user123',
        agreeCheckbox: true,
        publicDisplay: true,
      };

      // Setup getUserSignature to return null (no existing signature)
      jest.spyOn(service, 'getUserSignature').mockResolvedValue(null);

      // Setup the mock collection correctly
      const mockCollection = {
        create: jest.fn().mockResolvedValue({
          id: 'sig-id',
          author_id: createSignatureDto.userId,
          agree_checkbox: createSignatureDto.agreeCheckbox,
          public_display: createSignatureDto.publicDisplay,
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.createSignature(createSignatureDto);

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith(
        'signatures',
      );
      expect(mockCollection.create).toHaveBeenCalledWith({
        author_id: createSignatureDto.userId,
        agree_checkbox: createSignatureDto.agreeCheckbox,
        public_display: createSignatureDto.publicDisplay,
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('author_id', createSignatureDto.userId);
    });

    it('should throw conflict exception if user already has a signature', async () => {
      const createSignatureDto: CreateSignatureDto = {
        userId: 'user123',
        agreeCheckbox: true,
        publicDisplay: true,
      };

      // Mock that user already has a signature
      jest.spyOn(service, 'getUserSignature').mockResolvedValue({
        id: 'existing-sig',
        author_id: createSignatureDto.userId,
      } as any);

      await expect(service.createSignature(createSignatureDto)).rejects.toThrow(
        new HttpException(
          'User has already signed the petition',
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('deleteSignature', () => {
    it('should delete a signature if it belongs to the user', async () => {
      const signatureId = 'sig123';
      const userId = 'user123';

      // Setup the mock collection
      const mockCollection = {
        getOne: jest.fn().mockResolvedValue({
          id: signatureId,
          author_id: userId,
        }),
        delete: jest.fn().mockResolvedValue({}),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.deleteSignature(signatureId, userId);

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith(
        'signatures',
      );
      expect(mockCollection.getOne).toHaveBeenCalledWith(signatureId);
      expect(mockCollection.delete).toHaveBeenCalledWith(signatureId);

      expect(result).toEqual({
        success: true,
        message: 'Signature deleted successfully',
      });
    });

    it('should throw forbidden exception if signature does not belong to the user', async () => {
      const signatureId = 'sig123';
      const userId = 'user123';
      const otherUserId = 'user456';

      // Create a forbidden error that will be caught by handlePocketBaseError
      const error = new Error('Unauthorized to delete this signature');
      (error as any).status = 403;

      // Mock collection to throw the error when getOne is called
      const mockCollection = {
        getOne: jest.fn().mockRejectedValue(error),
        delete: jest.fn(),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      await expect(
        service.deleteSignature(signatureId, userId),
      ).rejects.toThrow('Unauthorized access');

      expect(mockCollection.delete).not.toHaveBeenCalled();
    });
  });

  describe('getUserSignature', () => {
    it('should return user signature if found', async () => {
      const userId = 'user123';
      const mockSignature = {
        id: 'sig123',
        author_id: userId,
        public_display: true,
      };

      // Setup the mock correctly
      const mockCollection = {
        getList: jest.fn().mockResolvedValue({
          items: [mockSignature],
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.getUserSignature(userId);

      expect(mockPocketBaseInstance.collection).toHaveBeenCalledWith(
        'signatures',
      );
      expect(mockCollection.getList).toHaveBeenCalledWith(1, 1, {
        filter: `author_id = "${userId}"`,
      });

      expect(result).toEqual(mockSignature);
    });

    it('should return null if no signature found', async () => {
      const userId = 'user123';

      // Setup the mock to return empty items array
      const mockCollection = {
        getList: jest.fn().mockResolvedValue({
          items: [],
        }),
      };

      mockPocketBaseInstance.collection.mockReturnValue(mockCollection);

      const result = await service.getUserSignature(userId);

      expect(result).toBeNull();
    });
  });
});
