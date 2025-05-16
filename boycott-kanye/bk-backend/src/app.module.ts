import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PocketbaseModule } from './pocketbase/pocketbase.module';
import { SignaturesModule } from './signatures/signatures.module';

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
export class AppModule {}
