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
    description: 'Id of user',
    example: '123',
  })
  userId: number;

  @ApiProperty({
    description: 'Name of the profile',
    example: 'John Doe',
  })
  name: string;
}
