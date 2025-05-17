import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PocketBase from 'pocketbase';
import { CreateSignatureDto } from '../signatures/dto/create-signature.dto.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { LoginDto } from '../auth/dto/login.dto.js';

@Injectable()
export class PocketbaseService implements OnModuleInit {
  private pb: PocketBase;
  private readonly logger = new Logger(PocketbaseService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.pb = new PocketBase(
      this.configService.get<string>('POCKETBASE_URL') ||
        'http://localhost:8090',
    );
    this.logger.log(`PocketBase initialized with URL: ${this.pb.baseUrl}`);
    // Sprawdź połączenie z PocketBase
    this.checkPocketBaseConnection();
  }

  // Sprawdź czy PocketBase jest dostępny
  private async checkPocketBaseConnection() {
    try {
      const health = await this.pb.health.check();
      this.logger.log(`PocketBase connection successful. Code: ${health.code}`);
    } catch (error) {
      this.logger.error(`PocketBase connection failed: ${error.message}`);
    }
  }

  // Authentication methods
  async register(registerDto: RegisterDto) {
    try {
      const { email, password, passwordConfirm, name } = registerDto;
      const user = await this.pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
      });

      this.logger.log(`User registered successfully: ${email}`);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        created: user.created,
      };
    } catch (error) {
      this.handlePocketBaseError(error, 'User registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const authData = await this.pb
        .collection('users')
        .authWithPassword(email, password);

      this.logger.log(`User logged in successfully: ${email}`);
      return {
        token: this.pb.authStore.token,
        user: {
          id: authData.record.id,
          email: authData.record.email,
          name: authData.record.name,
        },
      };
    } catch (error) {
      this.handlePocketBaseError(error, 'Login failed');
    }
  }

  // Signature methods
  async getSignatures() {
    try {
      this.logger.debug('Fetching signatures from PocketBase');

      // Pobierz wszystkie sygnatury
      const records = await this.pb.collection('signatures').getList(1, 100, {
        expand: 'user',
      });

      // Filtruj po public_display lokalnie
      const publicRecords = records.items.filter(
        (record) => record.public_display === true,
      );

      this.logger.debug(
        `Found ${publicRecords.length} public signatures out of ${records.items.length} total`,
      );

      return publicRecords.map((record) => {
        // Zawsze maskuj email w publicznych sygnaturach
        if (record.expand?.user) {
          const email = record.expand.user.email;
          record.expand.user.email = this.maskEmail(email);
        }
        return record;
      });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve signatures: ${JSON.stringify(error)}`,
      );
      this.handlePocketBaseError(error, 'Failed to retrieve signatures');
    }
  }

  async createSignature(createSignatureDto: CreateSignatureDto) {
    try {
      const { userId, agreeCheckbox, publicDisplay } = createSignatureDto;
      this.logger.debug(`Creating signature for user: ${userId}`);

      // Check if user already has a signature
      const existingSignature = await this.getUserSignature(userId);
      if (existingSignature) {
        throw new HttpException(
          'User has already signed the petition',
          HttpStatus.CONFLICT,
        );
      }

      // Directly try to create the signature
      // PocketBase will handle the error if collection doesn't exist

      const signature = await this.pb.collection('signatures').create({
        user: userId, // to jest połączenie z user-id
        agree_checkbox: agreeCheckbox,
        public_display: publicDisplay,
      });

      this.logger.log(`Signature created successfully for user: ${userId}`);
      return signature;
    } catch (error) {
      this.logger.error(`Failed to create signature: ${JSON.stringify(error)}`);
      this.handlePocketBaseError(error, 'Failed to create signature');
    }
  }

  async getUserSignature(userId: string) {
    try {
      this.logger.debug(`Getting signature for user: ${userId}`);

      // Szukamy po polu 'user', które jest relacją do kolekcji users
      const records = await this.pb.collection('signatures').getList(1, 1, {
        filter: `user.id = "${userId}"`,
        expand: 'user',
      });

      if (records.items.length > 0) {
        this.logger.debug(`Found signature for user: ${userId}`);
        return records.items[0];
      } else {
        this.logger.debug(`No signature found for user: ${userId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to retrieve signature for user: ${userId}: ${JSON.stringify(error)}`,
      );
      return null; // Return null instead of throwing an error to prevent 500 errors
    }
  }

  async deleteSignature(signatureId: string, userId: string) {
    try {
      this.logger.debug(
        `Deleting signature ${signatureId} for user: ${userId}`,
      );

      // Verify the signature belongs to the user
      const signature = await this.pb
        .collection('signatures')
        .getOne(signatureId);

      if (signature.user !== userId) {
        throw new HttpException(
          'Unauthorized to delete this signature',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.pb.collection('signatures').delete(signatureId);
      this.logger.log(`Signature ${signatureId} deleted successfully`);
      return { success: true, message: 'Signature deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete signature: ${signatureId}: ${JSON.stringify(error)}`,
      );
      this.handlePocketBaseError(
        error,
        `Failed to delete signature: ${signatureId}`,
      );
    }
  }

  // Utility methods
  private maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}*@${domain}`;
    }
    return `${username[0]}${this.generateAsterisks(username.length - 2)}${username[username.length - 1]}@${domain}`;
  }

  private generateAsterisks(length: number): string {
    return '*'.repeat(Math.min(length, 5));
  }

  private handlePocketBaseError(error: any, message: string): never {
    this.logger.error(`${message}: ${error.message}`);

    // Handle common PocketBase errors
    if (error.status === 400) {
      throw new HttpException(
        {
          message: 'Validation error',
          details: error.response?.data || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (error.status === 401 || error.status === 403) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    } else if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        message || 'An error occurred with the database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
