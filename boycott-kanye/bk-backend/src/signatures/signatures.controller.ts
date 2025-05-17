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
  Logger,
  UnauthorizedException,
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
  private readonly logger = new Logger(SignaturesController.name);

  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all signatures' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all signatures',
    type: [SignatureDto],
  })
  async getSignatures() {
    this.logger.log('Getting all signatures');
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
    if (!req.user || !req.user.id) {
      this.logger.error('Cannot create signature: User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    this.logger.log(`Creating signature for user: ${req.user.id}`);

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
    if (!req.user || !req.user.id) {
      this.logger.error('Cannot get user signature: User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    this.logger.log(`Getting signature for user: ${req.user.id}`);
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
    if (!req.user || !req.user.id) {
      this.logger.error('Cannot delete signature: User not authenticated');
      throw new UnauthorizedException('User not authenticated');
    }

    this.logger.log(`Deleting signature ${id} for user: ${req.user.id}`);
    return this.pocketbaseService.deleteSignature(id, req.user.id);
  }
}
