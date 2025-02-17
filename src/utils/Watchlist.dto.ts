import { ApiProperty } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 3, description: 'Content ID' })
  contentId: number;
}
