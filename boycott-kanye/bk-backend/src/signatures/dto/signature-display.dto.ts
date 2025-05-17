import { ApiProperty } from '@nestjs/swagger';

export class SignatureDisplayDto {
  @ApiProperty({
    description: 'Unique identifier of the signature',
    example: 'abc123xyz456',
  })
  id: string;

  @ApiProperty({
    description:
      'Display name of the signer (full name if public, "Anonymous" if private)',
    example: 'John Doe',
  })
  displayName: string;

  @ApiProperty({
    description: 'Date when the signature was created',
    example: '2023-08-15T12:30:45.123Z',
  })
  created: string;
}
