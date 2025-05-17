import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { PocketbaseModule } from '../pocketbase/pocketbase.module.js';

@Module({
  imports: [PocketbaseModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
