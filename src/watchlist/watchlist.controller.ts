import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
  UseFilters,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateWatchlistDto } from 'src/utils/Watchlist.dto';
import { PrismaExceptionFilter } from 'src/common/exceptions/prisma-exception.filter';

@Controller('watchlist')
@UseGuards(AuthGuard) // Protection par token d'authentification
@UseFilters(PrismaExceptionFilter) // Applique le filtre globalement pour ce contrôleur
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
  async create(
    @Req() request: Request,
    @Body() data: CreateWatchlistDto,
  ): Promise<any> {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return await this.watchlistService.createWatchList(user.sub, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all watchlist entries with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'Successfully fetched watchlist.' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.watchlistService.getAllWatchList(
      Number(page),
      Number(limit),
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get watchlist of a user with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Successfully fetched user watchlist.' })
  @ApiResponse({ status: 404, description: 'User watchlist not found.' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.watchlistService.getWatchlistByUser(Number(userId), Number(page), Number(limit));
  }

  @Get('entry/:id')
  @ApiOperation({ summary: 'Get one watchlist by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched watchlist.',
  })
  @ApiResponse({ status: 404, description: 'watchlist not found.' })
  async getWatchlistById(@Param('id') id: string) {
    return await this.watchlistService.getWatchlistById(Number(id));
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
