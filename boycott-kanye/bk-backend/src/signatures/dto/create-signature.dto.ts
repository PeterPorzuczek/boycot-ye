import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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
