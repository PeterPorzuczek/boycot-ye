import { Module } from '@nestjs/common';
import { PocketbaseService } from './pocketbase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PocketbaseService],
  exports: [PocketbaseService],
})
export class PocketbaseModule {}
