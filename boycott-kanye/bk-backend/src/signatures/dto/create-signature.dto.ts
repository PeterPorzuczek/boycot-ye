import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSignatureDto {
  @ApiProperty({
    description: 'The ID of the user creating the signature',
    example: 'user123456',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Email address of the person signing the petition',
    example: 'signer@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Name of the person signing the petition',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Confirmation checkbox that the user agrees with the petition',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  agreeCheckbox: boolean;

  @ApiProperty({
    description:
      'Whether the signature should be publicly displayed with user info',
    example: true,
  })
  @IsBoolean()
  publicDisplay: boolean;
}
