import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { SignaturesController } from './signatures.controller';
import { PocketbaseService } from '../pocketbase/pocketbase.service';
import { CreateSignatureDto } from './dto/create-signature.dto';

// Definicja typu RecordModel dla sygnatur
interface RecordModel {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: any;
}

describe('SignaturesController', () => {
  let controller: SignaturesController;
  let pocketbaseService: jest.Mocked<Partial<PocketbaseService>>;

  beforeEach(async () => {
    // Mock PocketbaseService
    const mockPocketbaseService = {
      getSignatures: jest.fn(),
      createSignature: jest.fn(),
      getUserSignature: jest.fn(),
      deleteSignature: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignaturesController],
      providers: [
        {
          provide: PocketbaseService,
          useValue: mockPocketbaseService,
        },
      ],
    }).compile();

    controller = module.get<SignaturesController>(SignaturesController);
    pocketbaseService = module.get(PocketbaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSignatures', () => {
    it('should return an array of signatures', async () => {
      const mockSignatures: RecordModel[] = [
        {
          id: 'sig1',
          author_id: 'user1',
          public_display: true,
          collectionId: 'signatures',
          collectionName: 'signatures',
          created: '2023-01-01 12:00:00',
          updated: '2023-01-01 12:00:00',
        },
        {
          id: 'sig2',
          author_id: 'user2',
          public_display: true,
          collectionId: 'signatures',
          collectionName: 'signatures',
          created: '2023-01-01 12:00:00',
          updated: '2023-01-01 12:00:00',
        },
      ];

      pocketbaseService.getSignatures.mockResolvedValue(mockSignatures);

      const result = await controller.getSignatures();

      expect(pocketbaseService.getSignatures).toHaveBeenCalled();
      expect(result).toEqual(mockSignatures);
    });
  });

  describe('createSignature', () => {
    it('should create a signature and return it', async () => {
      const createSignatureDto: CreateSignatureDto = {
        userId: 'original-user-id',
        agreeCheckbox: true,
        publicDisplay: true,
      };

      const authenticatedUserId = 'user123';
      const req = {
        user: {
          id: authenticatedUserId,
        },
      };

      const mockCreatedSignature: RecordModel = {
        id: 'sig123',
        author_id: authenticatedUserId,
        agree_checkbox: true,
        public_display: true,
        collectionId: 'signatures',
        collectionName: 'signatures',
        created: '2023-01-01 12:00:00',
        updated: '2023-01-01 12:00:00',
      };

      pocketbaseService.createSignature.mockResolvedValue(mockCreatedSignature);

      const result = await controller.createSignature(createSignatureDto, req);

      expect(createSignatureDto.userId).toBe(authenticatedUserId);

      expect(pocketbaseService.createSignature).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: authenticatedUserId,
          agreeCheckbox: true,
          publicDisplay: true,
        }),
      );

      expect(result).toEqual(mockCreatedSignature);
    });
  });

  describe('getCurrentUserSignature', () => {
    it('should return the signature of the current user', async () => {
      const req = {
        user: {
          id: 'user123',
        },
      };

      const mockSignature: RecordModel = {
        id: 'sig123',
        author_id: 'user123',
        public_display: true,
        collectionId: 'signatures',
        collectionName: 'signatures',
        created: '2023-01-01 12:00:00',
        updated: '2023-01-01 12:00:00',
      };

      pocketbaseService.getUserSignature.mockResolvedValue(mockSignature);

      const result = await controller.getCurrentUserSignature(req);

      expect(pocketbaseService.getUserSignature).toHaveBeenCalledWith(
        'user123',
      );
      expect(result).toEqual(mockSignature);
    });

    it('should handle when user has no signature', async () => {
      const req = {
        user: {
          id: 'user123',
        },
      };

      pocketbaseService.getUserSignature.mockResolvedValue(null);

      const result = await controller.getCurrentUserSignature(req);

      expect(pocketbaseService.getUserSignature).toHaveBeenCalledWith(
        'user123',
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteSignature', () => {
    it('should delete a signature and return success response', async () => {
      const signatureId = 'sig123';
      const req = {
        user: {
          id: 'user123',
        },
      };

      const mockResponse = {
        success: true,
        message: 'Signature deleted successfully',
      };

      pocketbaseService.deleteSignature.mockResolvedValue(mockResponse);

      const result = await controller.deleteSignature(signatureId, req);

      expect(pocketbaseService.deleteSignature).toHaveBeenCalledWith(
        signatureId,
        'user123',
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
