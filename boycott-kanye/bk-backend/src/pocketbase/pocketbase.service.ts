import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PocketBase from './pocketbase-cjs';
import { CreateSignatureDto } from '../signatures/dto/create-signature.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';

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
  async getSignatures(): Promise<any[]> {
    try {
      this.logger.debug('Fetching signatures from PocketBase');

      // Pobierz wszystkie sygnatury
      const records = await this.pb.collection('signatures').getList(1, 100, {
        expand: 'user',
      });

      this.logger.debug(`Found ${records.items.length} total signatures`);

      return records.items.map((record) => {
        // For signatures with public_display = false, we return anonymous data
        if (!record.public_display) {
          // If this signature has full_name and email fields directly (from our schema update)
          if (record.full_name !== undefined) {
            // Return using the fields we added to signatures collection
            return {
              ...record,
              full_name: 'Anonymous',
              email: 'anonymous@example.com',
            };
          } else if (record.expand?.user) {
            // If we're using the old expand approach, modify the expanded user data
            record.expand.user.name = 'Anonymous';
            record.expand.user.email = 'anonymous@example.com';
          }
          return record;
        }

        // For public signatures, mask the email if expanded user data is available
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

  async createSignature(createSignatureDto: CreateSignatureDto): Promise<any> {
    try {
      const { userId, agreeCheckbox, publicDisplay, email, name } =
        createSignatureDto;
      this.logger.debug(
        `Creating signature for user: ${userId}, public: ${publicDisplay}`,
      );

      const existingSignature = await this.getUserSignature(userId);
      if (existingSignature) {
        throw new HttpException(
          'User has already signed the petition',
          HttpStatus.CONFLICT,
        );
      }

      let fullName = 'Anonymous';
      let signatureEmail = 'anonymous@example.com';

      fullName = name ? name : 'Anonymous';

      signatureEmail = email
        ? this.anonymizeEmail(email)
        : 'anonymous@example.com';

      if ((!name || !email) && userId) {
        try {
          const user = await this.pb.collection('users').getOne(userId);
          if (publicDisplay === true) {
            // Only use user data if explicitly requested fields weren't provided in the DTO
            if (!name && user.name) {
              fullName = user.name;
            }
            if (!email && user.email && user.email.includes('@')) {
              signatureEmail = this.anonymizeEmail(user.email);
            } else if (!email) {
              signatureEmail = 'invalid-email@example.com'; // Fallback for malformed email
            }
          }
        } catch (userError) {
          this.logger.warn(
            `Could not fetch user details for ${userId} during signature creation: ${userError.message}`,
          );
          // If user fetch fails, we'll use the values already set above
        }
      }

      const signatureData = {
        author_id: userId,
        agree_checkbox: agreeCheckbox,
        public_display: publicDisplay,
        full_name: fullName,
        email: signatureEmail,
      };

      const signature = await this.pb
        .collection('signatures')
        .create(signatureData);
      this.logger.log(
        `Signature created successfully for user: ${userId} with ID: ${signature.id}`,
      );
      return signature;
    } catch (error) {
      this.logger.error(`Failed to create signature: ${JSON.stringify(error)}`);
      this.handlePocketBaseError(error, 'Failed to create signature');
    }
  }

  async getUserSignature(userId: string): Promise<any | null> {
    try {
      this.logger.debug(`Getting signature for user: ${userId}`);

      // Szukamy po polu 'author_id', które jest ID użytkownika
      const records = await this.pb.collection('signatures').getList(1, 1, {
        filter: `author_id = "${userId}"`,
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

  async updateSignature(
    signatureId: string,
    userId: string,
    updateData: any,
  ): Promise<any> {
    try {
      this.logger.debug(
        `Updating signature ${signatureId} for user: ${userId} with data: ${JSON.stringify(updateData)}`,
      );

      // Verify the signature belongs to the user
      const signature = await this.pb
        .collection('signatures')
        .getOne(signatureId);

      if (signature.author_id !== userId) {
        throw new HttpException(
          'Unauthorized to update this signature',
          HttpStatus.FORBIDDEN,
        );
      }

      // Fetch user data for anonymization
      const userData = await this.pb.collection('users').getOne(userId);

      // Anonymize user data
      const anonymizedEmail = userData.email
        ? this.anonymizeEmail(userData.email)
        : '';
      const anonymizedName = userData.name ? userData.name : '';

      // Prepare data for update - convert boolean to number if needed for PocketBase
      const data = { ...updateData };
      if ('publicDisplay' in data) {
        data.public_display = data.publicDisplay;
        delete data.publicDisplay;
      }

      // Add anonymized user data to the update
      data.anonymized_email = anonymizedEmail;
      data.anonymized_name = anonymizedName;
      data.email = anonymizedEmail;
      data.name = anonymizedName;

      const updated = await this.pb
        .collection('signatures')
        .update(signatureId, data);
      this.logger.log(`Signature ${signatureId} updated successfully`);
      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update signature ${signatureId}: ${JSON.stringify(error)}`,
      );
      this.handlePocketBaseError(
        error,
        `Failed to update signature: ${signatureId}`,
      );
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

      if (signature.author_id !== userId) {
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

  private anonymizeEmail(email: string): string {
    const [localPart, domain] = email.split('@');

    if (localPart.length <= 1) {
      return `${localPart}@${domain}`;
    }

    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];

    return `${firstChar}...${lastChar}@${domain}`;
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
