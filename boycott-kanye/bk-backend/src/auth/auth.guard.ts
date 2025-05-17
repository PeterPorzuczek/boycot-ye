import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.error('Missing authentication token in request');
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      // Check if we have user data in the request (would be set by middleware)
      if (!request.user) {
        this.logger.error('No user object in request');
        throw new UnauthorizedException('Invalid authentication token');
      }

      if (!request.user.id) {
        this.logger.error('No user ID in request');
        throw new UnauthorizedException('Invalid user identification');
      }

      this.logger.log(`Request authenticated for user ID: ${request.user.id}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Auth validation failed: ${error.message || 'unknown error'}`,
      );
      throw new UnauthorizedException('Authentication validation failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    this.logger.log(
      `Authorization header in guard: ${authHeader || 'not present'}`,
    );

    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
