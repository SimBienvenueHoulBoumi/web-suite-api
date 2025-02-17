import { ApiProperty } from '@nestjs/swagger';
import { ContentType, WatchStatus } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({ example: 'One Piece', description: 'Title of the content' })
  title: string;

  @ApiProperty({
    example: ContentType.ANIME,
    description: 'Type of content (ANIME, MANGA, WEBTOON)',
    enum: ContentType,
  })
  type: ContentType;

  @ApiProperty({
    example: WatchStatus.WATCHING,
    description: 'Watching status (WATCHING, COMPLETED, PLAN_TO_WATCH)',
    enum: WatchStatus,
  })
  status: WatchStatus;

  @ApiProperty({
    example: 1000,
    description: 'Total number of episodes (for anime)',
    required: false,
  })
  episodes?: number;

  @ApiProperty({
    example: 500,
    description: 'Total number of chapters (for manga/webtoon)',
    required: false,
  })
  chapters?: number;

  @ApiProperty({
    example: 100,
    description: 'Last watched episode (for anime)',
    required: false,
  })
  currentEp?: number;

  @ApiProperty({
    example: 50,
    description: 'Last read chapter (for manga/webtoon)',
    required: false,
  })
  currentChap?: number;
}

export class UpdateContentDto {
  @ApiProperty({
    example: 'One Piece',
    description: 'Title of the content',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: ContentType.ANIME,
    description: 'Type of content (ANIME, MANGA, WEBTOON)',
    enum: ContentType,
    required: false,
  })
  type?: ContentType;

  @ApiProperty({
    example: WatchStatus.WATCHING,
    description: 'Watching status (WATCHING, COMPLETED, PLAN_TO_WATCH)',
    enum: WatchStatus,
    required: false,
  })
  status?: WatchStatus;

  @ApiProperty({
    example: 1000,
    description: 'Total number of episodes (for anime)',
    required: false,
  })
  episodes?: number;

  @ApiProperty({
    example: 500,
    description: 'Total number of chapters (for manga/webtoon)',
    required: false,
  })
  chapters?: number;

  @ApiProperty({
    example: 100,
    description: 'Last watched episode (for anime)',
    required: false,
  })
  currentEp?: number;

  @ApiProperty({
    example: 50,
    description: 'Last read chapter (for manga/webtoon)',
    required: false,
  })
  currentChap?: number;
}
