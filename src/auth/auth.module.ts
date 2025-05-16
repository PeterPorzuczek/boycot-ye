import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PocketbaseModule } from '../pocketbase/pocketbase.module';

@Module({
  imports: [PocketbaseModule],
  controllers: [AuthController],
})
export class AuthModule {} 