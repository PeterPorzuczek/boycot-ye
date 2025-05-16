import { Module } from '@nestjs/common';
import { SignaturesController } from './signatures.controller';
import { PocketbaseModule } from '../pocketbase/pocketbase.module';

@Module({
  imports: [PocketbaseModule],
  controllers: [SignaturesController],
})
export class SignaturesModule {}
