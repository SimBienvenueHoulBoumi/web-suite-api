import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Name of the profile',
    example: 'John Doe',
  })
  name: string;
}

export class CreateProfileDto {
  @ApiProperty({
    description: 'Name of the profile',
    example: 'John Doe',
  })
  name: string;
}
