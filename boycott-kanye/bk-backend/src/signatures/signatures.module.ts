import { Module } from '@nestjs/common';
import { SignaturesController } from './signatures.controller.js';
import { PocketbaseModule } from '../pocketbase/pocketbase.module.js';

@Module({
  imports: [PocketbaseModule],
  controllers: [SignaturesController],
})
export class SignaturesModule {}
