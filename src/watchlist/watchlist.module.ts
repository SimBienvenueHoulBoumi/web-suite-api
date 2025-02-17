import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';

@Module({
  providers: [WatchlistService, PrismaService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
