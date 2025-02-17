import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateWatchlistDto } from 'src/utils/Watchlist.dto';

@Controller('watchlist')
@UseGuards(AuthGuard) // Protection par token d'authentification
@ApiBearerAuth()
@ApiTags('Watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add content to watchlist' })
  @ApiResponse({
    status: 201,
    description: 'Content successfully added to watchlist.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  async create(@Body() data: CreateWatchlistDto): Promise<string> {
    return await this.watchlistService.createWatchList(
      data.userId,
      data.contentId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all watchlist entries' })
  @ApiResponse({ status: 200, description: 'Successfully fetched watchlist.' })
  async findAll() {
    return await this.watchlistService.getAllWatchList();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get watchlist of a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched user watchlist.',
  })
  @ApiResponse({ status: 404, description: 'User watchlist not found.' })
  async findByUser(@Param('userId') userId: string) {
    return await this.watchlistService.getWatchlistByUser(Number(userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one watchlist by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched watchlist.',
  })
  @ApiResponse({ status: 404, description: 'watchlist not found.' })
  async getWatchlistById(@Param('id') id: string) {
    return await this.watchlistService.getWatchlistByUser(Number(id));
  }

  @Delete(':userId/:contentId')
  @ApiOperation({ summary: 'Remove content from watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Content successfully removed from watchlist.',
  })
  @ApiResponse({ status: 404, description: 'Watchlist entry not found.' })
  async delete(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ): Promise<string> {
    return await this.watchlistService.deleteWatchListEntry(
      Number(userId),
      Number(contentId),
    );
  }
}
