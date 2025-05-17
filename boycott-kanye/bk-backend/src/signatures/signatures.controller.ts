import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PocketbaseService } from '../pocketbase/pocketbase.service.js';
import { CreateSignatureDto } from './dto/create-signature.dto.js';
import { SignatureDto } from './dto/signature.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@ApiTags('signatures')
@Controller('signatures')
export class SignaturesController {
  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all signatures' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all signatures',
    type: [SignatureDto],
  })
  async getSignatures() {
    return this.pocketbaseService.getSignatures();
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new signature' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Signature created successfully',
    type: SignatureDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already signed the petition',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  @HttpCode(HttpStatus.CREATED)
  async createSignature(
    @Body() createSignatureDto: CreateSignatureDto,
    @Request() req,
  ) {
    // Override userId with the authenticated user's ID
    createSignatureDto.userId = req.user.id;
    return this.pocketbaseService.createSignature(createSignatureDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current user's signature" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User's signature",
    type: SignatureDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User has not signed the petition yet',
  })
  async getCurrentUserSignature(@Request() req) {
    return this.pocketbaseService.getUserSignature(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a signature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signature deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not authorized to delete this signature',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Signature not found',
  })
  async deleteSignature(@Param('id') id: string, @Request() req) {
    return this.pocketbaseService.deleteSignature(id, req.user.id);
  }
}
