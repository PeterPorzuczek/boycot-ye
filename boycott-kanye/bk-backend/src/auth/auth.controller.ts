import { Body, Controller, Post } from '@nestjs/common';
import { PocketbaseService } from '../pocketbase/pocketbase.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly pocketbaseService: PocketbaseService) {}

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    return this.pocketbaseService.register(
      registerDto.email,
      registerDto.password,
      registerDto.password, // passwordConfirm jest takie samo jak password
      registerDto.name,
    );
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.pocketbaseService.login(loginDto.email, loginDto.password);
  }
} 