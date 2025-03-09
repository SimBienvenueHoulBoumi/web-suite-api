import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from './types';

export class CreateWatchlistDto {
  @ApiProperty({ example: 'one title', description: 'one peace' })
  title: string;

  @ApiProperty({ example: 'MANGA', description: 'type of content' })
  type: ContentType;

  @ApiProperty({ example: 3, description: 'currentEp number' })
  currentEp: number;

  @ApiProperty({ example: 3, description: 'currentChap number' })
  currentChap: number;
}

export class UpdateWatchlistDto {
  @ApiProperty({ example: 'one title', description: 'one peace', required: false })
  title?: string;

  @ApiProperty({ example: 'MANGA', description: 'type of content', required: false })
  type?: ContentType;

  @ApiProperty({ example: 3, description: 'currentEp number', required: false })
  currentEp?: number;

  @ApiProperty({ example: 3, description: 'currentChap number', required: false })
  currentChap?: number;
}
