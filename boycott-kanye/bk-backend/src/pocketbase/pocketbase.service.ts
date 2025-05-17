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
  }

  // Authentication methods
  async register(registerDto: RegisterDto) {
    try {
      const { email, password, passwordConfirm, name } = registerDto;
      this.logger.log(`Attempting to register user: ${email}`);

      // Ensure passwordConfirm matches password
      if (password !== passwordConfirm) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
      });

      this.logger.log(`User registered successfully with ID: ${user.id}`);

      // Clean sensitive data
      const userData = {
        id: user.id || '',
        email: user.email || '',
        name: user.name || '',
        created: user.created || new Date().toISOString(),
      };

      return userData;
    } catch (error) {
      this.handlePocketBaseError(error, 'User registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      this.logger.log(`Attempting to login user: ${email}`);

      const authData = await this.pb
        .collection('users')
        .authWithPassword(email, password);

      if (!authData || !this.pb.authStore.token) {
        throw new HttpException(
          'Authentication failed',
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.logger.log(`User logged in successfully: ${email}`);
      this.logger.log(
        `Token provided: ${this.pb.authStore.token ? 'yes' : 'no'}`,
      );

      // Clean sensitive data
      const userData = {
        token: this.pb.authStore.token,
        user: {
          id: authData.record?.id || '',
          email: authData.record?.email || '',
          name: authData.record?.name || '',
        },
      };

      return userData;
    } catch (error) {
      this.handlePocketBaseError(error, 'Login failed');
    }
  }

  // Signature methods
  async getSignatures() {
    try {
      this.logger.log('Fetching signatures list');
      const records = await this.pb.collection('signatures').getList(1, 100, {
        expand: 'user',
        sort: '-created',
      });

      this.logger.log(`Found ${records.items.length} signatures`);

      return records.items.map((record) => {
        // Mask emails if signature is public
        if (record.expand?.user && record.public_display) {
          const email = record.expand.user.email || '';
          record.expand.user.email = this.maskEmail(email);
        } else if (!record.public_display) {
          // If signature is not public, hide user data
          record.expand = { user: { name: 'Anonymous', email: '' } };
        }
        return record;
      });
    } catch (error) {
      this.handlePocketBaseError(error, 'Failed to retrieve signatures');
    }
  }

  async createSignature(createSignatureDto: CreateSignatureDto) {
    try {
      const { userId, agreeCheckbox, publicDisplay } = createSignatureDto;
      this.logger.log(`Creating signature for user: ${userId}`);

      // Check if user already has a signature
      const existingSignature = await this.getUserSignature(userId);
      if (existingSignature) {
        this.logger.warn(`User ${userId} already has a signature`);
        throw new HttpException(
          'User has already signed the petition',
          HttpStatus.CONFLICT,
        );
      }

      // Validate the data
      if (!agreeCheckbox) {
        throw new HttpException(
          'You must agree to sign the petition',
          HttpStatus.BAD_REQUEST,
        );
      }

      const signature = await this.pb.collection('signatures').create({
        user: userId,
        agree_checkbox: agreeCheckbox,
        public_display: publicDisplay,
      });

      this.logger.log(
        `Signature created successfully with ID: ${signature.id}`,
      );
      return signature;
    } catch (error) {
      this.handlePocketBaseError(error, 'Failed to create signature');
    }
  }

  async getUserSignature(userId: string) {
    try {
      this.logger.log(`Searching for signature by user: ${userId}`);
      const records = await this.pb.collection('signatures').getList(1, 1, {
        filter: `user = "${userId}"`,
        expand: 'user',
      });

      const found = records.items.length > 0;
      this.logger.log(
        `Signature for user ${userId}: ${found ? 'found' : 'not found'}`,
      );

      return found ? records.items[0] : null;
    } catch (error) {
      this.handlePocketBaseError(
        error,
        `Failed to retrieve signature for user: ${userId}`,
      );
    }
  }

  async deleteSignature(signatureId: string, userId: string) {
    try {
      this.logger.log(
        `Attempting to delete signature ${signatureId} for user ${userId}`,
      );

      // Verify the signature exists
      let signature;
      try {
        signature = await this.pb.collection('signatures').getOne(signatureId);
      } catch (err) {
        this.logger.error(`Signature ${signatureId} not found`);
        throw new HttpException('Signature not found', HttpStatus.NOT_FOUND);
      }

      // Verify the signature belongs to the user
      if (signature.user !== userId) {
        this.logger.error(
          `User ${userId} not authorized to delete signature ${signatureId}`,
        );
        throw new HttpException(
          'Unauthorized to delete this signature',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.pb.collection('signatures').delete(signatureId);
      this.logger.log(`Signature ${signatureId} deleted successfully`);
      return { success: true, message: 'Signature deleted successfully' };
    } catch (error) {
      this.handlePocketBaseError(
        error,
        `Failed to delete signature: ${signatureId}`,
      );
    }
  }

  // Utility methods
  private maskEmail(email: string): string {
    if (!email) return '';

    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    if (username.length <= 2) {
      return `${username[0]}*@${domain}`;
    }
    return `${username[0]}${this.generateAsterisks(username.length - 2)}${username[username.length - 1]}@${domain}`;
  }

  private generateAsterisks(length: number): string {
    return '*'.repeat(Math.min(length, 5));
  }

  private handlePocketBaseError(error: any, message: string): never {
    const errorMsg = error?.message || 'Unknown error';
    this.logger.error(`${message}: ${errorMsg}`);

    // Get any response data
    const responseData = error?.response?.data || {};

    // Handle common PocketBase errors
    if (error?.status === 400) {
      throw new HttpException(
        {
          message: 'Validation error',
          details: responseData,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (error?.status === 401 || error?.status === 403) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    } else if (error?.status === 404) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
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
