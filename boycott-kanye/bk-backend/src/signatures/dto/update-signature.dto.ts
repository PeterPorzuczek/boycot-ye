import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSignatureDto {
  @ApiProperty({
    description: 'Whether to display the signature publicly',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  publicDisplay?: boolean;
}
