import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { Content } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateContentDto } from 'src/utils/Content.dto';
import { UpdateContentDto } from 'src/utils/Content.dto';

@Controller('contents')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new content (Anime, Manga, Webtoon)' })
  @ApiResponse({ status: 201, description: 'Content successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  async create(@Body() createContentDto: CreateContentDto): Promise<Content> {
    return await this.contentsService.createContent(
      createContentDto.title,
      createContentDto.type,
      createContentDto.status,
      createContentDto.episodes,
      createContentDto.chapters,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all contents' })
  @ApiResponse({ status: 200, description: 'Successfully fetched contents.' })
  async findAll(): Promise<Content[]> {
    return await this.contentsService.getAllContents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a content by ID' })
  @ApiResponse({ status: 200, description: 'Content found.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async findOne(@Param('id') id: string): Promise<Content | null> {
    return await this.contentsService.getContentById(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a content' })
  @ApiResponse({ status: 200, description: 'Content successfully updated.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    return await this.contentsService.updateContent(
      Number(id),
      updateContentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a content' })
  @ApiResponse({ status: 200, description: 'Content successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async delete(@Param('id') id: string): Promise<Content> {
    return await this.contentsService.deleteContent(Number(id));
  }
}
