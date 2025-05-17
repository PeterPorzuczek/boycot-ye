import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PocketbaseService } from '../pocketbase/pocketbase.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid registration data',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registering user: ${registerDto.email}`);
    const result = await this.pocketbaseService.register(registerDto);
    this.logger.log(`Registration successful for user: ${registerDto.email}`);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and receive token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authenticated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);
    const result = await this.pocketbaseService.login(loginDto);
    this.logger.log(
      `Login successful for user: ${loginDto.email}, token provided`,
    );
    return result;
  }
}
