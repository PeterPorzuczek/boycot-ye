import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import PocketBase from 'pocketbase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
      pb?: PocketBase;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Create a new PocketBase instance for each request
      const pb = new PocketBase(
        this.configService.get<string>('POCKETBASE_URL') ||
          'http://localhost:8090',
      );

      // Attach PocketBase to request for later use
      req.pb = pb;

      const token = this.extractTokenFromHeader(req);
      this.logger.log(`Token extracted: ${token ? 'present' : 'missing'}`);

      if (token) {
        try {
          // Try to refresh the auth with the token
          pb.authStore.save(token, null);

          // Try to refresh the auth (will throw if token is invalid)
          if (pb.authStore.isValid) {
            this.logger.log('Token is valid, attempting to get user data');

            // If token is valid, set the user data in the request
            const userData = pb.authStore.model;

            if (userData) {
              req.user = {
                id: userData.id,
                email: userData.email || '',
                name: userData.name || '',
              };
              this.logger.log(`Authenticated user ID: ${req.user.id}`);
            } else {
              this.logger.warn('Token valid but no user data found');
            }
          } else {
            this.logger.warn('Token is invalid');
          }
        } catch (error) {
          this.logger.error(`Token validation error: ${error.message}`);
          pb.authStore.clear();
        }
      } else {
        this.logger.log('No token provided');
      }
    } catch (error) {
      this.logger.error(
        `Auth middleware error: ${error.message || 'Unknown error'}`,
      );
    }

    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    this.logger.log(`Authorization header: ${authHeader || 'not present'}`);

    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
