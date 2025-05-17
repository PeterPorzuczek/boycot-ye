import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import PocketBase from '../pocketbase/pocketbase-cjs';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private pb: PocketBase;
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private configService: ConfigService) {
    this.pb = new PocketBase(
      this.configService.get<string>('POCKETBASE_URL') ||
        'http://localhost:8090',
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extractTokenFromHeader(req);
      if (token) {
        this.logger.debug(`Token found: ${token.substring(0, 15)}...`);

        // Wyczyść autentykację przed sprawdzeniem
        this.pb.authStore.clear();

        // Zapisz token w authStore
        this.pb.authStore.save(token, null);

        try {
          // Wymuś pobranie danych użytkownika
          const authData = await this.pb.collection('users').authRefresh();
          this.logger.debug('Auth refresh successful');

          if (authData && authData.record) {
            this.logger.debug(`User data: ${JSON.stringify(authData.record)}`);
            req.user = {
              id: authData.record.id,
              email: authData.record.email,
              name: authData.record.name,
            };
            this.logger.debug(`User set in request: ${req.user.email}`);
          } else {
            this.logger.warn('Auth refresh returned no record');
            req.user = undefined;
          }
        } catch (err) {
          this.logger.error(`Auth refresh failed: ${JSON.stringify(err)}`);
          req.user = undefined;
        }
      } else {
        this.logger.debug('No token in request');
      }
    } catch (error) {
      this.logger.error(`Middleware error: ${JSON.stringify(error)}`);
      this.pb.authStore.clear();
    }

    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
