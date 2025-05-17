import { ApiProperty } from '@nestjs/swagger';

export class SignatureUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123456',
  })
  id: string;

  @ApiProperty({
    description: 'User name (or "Anonymous" if private)',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email (masked if shown)',
    example: 'j***e@example.com',
  })
  email: string;
}

export class SignatureDto {
  @ApiProperty({
    description: 'Unique identifier of the signature',
    example: 'sig123456',
  })
  id: string;

  @ApiProperty({
    description: 'Reference to the user who signed',
    example: 'user123456',
  })
  user: string;

  @ApiProperty({
    description: 'Whether the user agreed with the petition',
    example: true,
  })
  agree_checkbox: boolean;

  @ApiProperty({
    description: 'Whether the signature is displayed publicly with user info',
    example: true,
  })
  public_display: boolean;

  @ApiProperty({
    description: 'When the signature was created',
    example: '2023-05-15 10:30:45',
  })
  created: string;

  @ApiProperty({
    description: 'Expanded user information',
    type: SignatureUserDto,
  })
  expand?: {
    user: SignatureUserDto;
  };
}
