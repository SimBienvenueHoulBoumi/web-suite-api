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
  Put,
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
import {
  CreateWatchlistDto,
  UpdateWatchlistDto,
} from 'src/utils/Watchlist.dto';
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

  @Put()
  @ApiOperation({ summary: 'Update watchlist' })
  @ApiResponse({
    status: 201,
    description: 'Content successfully updated to watchlist.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  async update(
    @Req() request: Request,
    @Body() data: UpdateWatchlistDto,
  ): Promise<any> {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.watchlistService.updateWatchList(user.sub, data);

    return 'Content successfully updated to watchlist.';
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
    @Req() request: Request,
  ) {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return await this.watchlistService.getWatchlistByUser(
      user.sub,
      Number(page),
      Number(limit),
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get one watchlist by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched watchlist.',
  })
  @ApiResponse({ status: 404, description: 'Watchlist not found.' })
  async getWatchlistById(@Param('id') id: string, @Req() request: Request) {
    const user = request['user'];

    if (!user.sub) {
      throw new UnauthorizedException('User not found');
    }

    return await this.watchlistService.getWatchlistById(Number(id));
  }

  @Delete('/:Id')
  @ApiOperation({ summary: 'Remove content from watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Content successfully removed from watchlist.',
  })
  @ApiResponse({ status: 404, description: 'Watchlist entry not found.' })
  async delete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<string> {
    const user = request['user'];

    if (!user || user.sub) {
      throw new UnauthorizedException(
        'User not authorized to delete this watchlist entry',
      );
    }

    return await this.watchlistService.deleteWatchListEntry(
      Number(user.sub),
      Number(id),
    );
  }
}
