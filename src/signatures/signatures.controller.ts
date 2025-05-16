import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PocketbaseService } from '../pocketbase/pocketbase.service';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Get()
  async getSignatures() {
    return this.pocketbaseService.getSignatures();
  }

  @Post()
  async createSignature(
    @Body() createSignatureDto: { userId: string; agreeCheckbox: boolean; publicDisplay: boolean },
  ) {
    return this.pocketbaseService.createSignature(
      createSignatureDto.userId,
      createSignatureDto.agreeCheckbox,
      createSignatureDto.publicDisplay,
    );
  }

  @Get('user/:userId')
  async getUserSignature(@Param('userId') userId: string) {
    return this.pocketbaseService.getUserSignature(userId);
  }

  @Delete(':id')
  async deleteSignature(@Param('id') id: string) {
    return this.pocketbaseService.deleteSignature(id);
  }
} 