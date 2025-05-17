import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  HttpException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { PocketbaseService } from '../pocketbase/pocketbase.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { SignatureDto } from './dto/signature.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('signatures')
@Controller('signatures')
export class SignaturesController {
  private readonly logger = new Logger(SignaturesController.name);

  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all signatures' })
  @ApiResponse({
    status: 200,
    description: 'Returns all signatures in the system',
  })
  async getSignatures(): Promise<any[]> {
    return this.pocketbaseService.getSignatures();
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new signature' })
  @ApiBody({ type: CreateSignatureDto })
  @ApiResponse({
    status: 201,
    description: 'The signature has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User has already signed' })
  @HttpCode(HttpStatus.CREATED)
  async createSignature(
    @Body() createSignatureDto: CreateSignatureDto,
    @Request() req,
  ): Promise<any> {
    // Override userId with the authenticated user's ID
    createSignatureDto.userId = req.user.id;
    return this.pocketbaseService.createSignature(createSignatureDto);
  }

  @Get('me')
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
  async getCurrentUserSignature(@Request() req): Promise<any | null> {
    return this.pocketbaseService.getUserSignature(req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a signature' })
  @ApiBody({ type: UpdateSignatureDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signature updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not authorized to update this signature',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Signature not found',
  })
  async updateSignature(
    @Param('id') id: string,
    @Body() updateSignatureDto: UpdateSignatureDto,
    @Request() req,
  ) {
    return this.pocketbaseService.updateSignature(
      id,
      req.user.id,
      updateSignatureDto,
    );
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
