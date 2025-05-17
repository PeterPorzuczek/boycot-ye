import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PocketbaseModule } from './pocketbase/pocketbase.module.js';
import { SignaturesModule } from './signatures/signatures.module.js';
import { AuthMiddleware } from './auth/auth.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PocketbaseModule,
    AuthModule,
    SignaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the auth middleware to all routes
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
