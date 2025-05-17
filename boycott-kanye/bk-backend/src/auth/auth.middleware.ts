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
        this.pb.authStore.save(token, null);
        try {
          // Wymuś pobranie modelu użytkownika na podstawie tokena
          const user = await this.pb.collection('users').authRefresh();
          req.user = {
            id: user.record.id,
            email: user.record.email,
            name: user.record.name,
          };
          this.logger.debug(`Authenticated user: ${req.user.email}`);
        } catch (err) {
          req.user = undefined;
          this.logger.debug('Invalid or expired token');
        }
      }
    } catch (error) {
      this.logger.error(`Auth middleware error: ${error.message}`);
      this.pb.authStore.clear();
    }
    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
