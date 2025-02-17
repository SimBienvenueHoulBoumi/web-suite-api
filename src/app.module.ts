import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';
import { WatchlistController } from './watchlist/watchlist.controller';
import { WatchlistService } from './watchlist/watchlist.service';
import { WatchlistModule } from './watchlist/watchlist.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    AuthModule,
    ContentsModule,
    WatchlistModule,
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService, PrismaService],
})
export class AppModule {}
