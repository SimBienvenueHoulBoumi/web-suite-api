import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Watchlist } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ContentType } from 'src/utils/types';
import { WatchStatus } from '@prisma/client';
import { CreateWatchlistDto } from 'src/utils/Watchlist.dto';
import { ErrorHandler } from 'src/common/error-handler';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  private getContentKey(value: string): ContentType {
    if (!Object.values(ContentType).includes(value as ContentType)) {
      throw new BadRequestException(`Invalid ContentType: ${value}`);
    }
    return value as ContentType;
  }

  private getStatusKey(value: string): WatchStatus {
    const formattedValue = value.replace(/\s+/g, '_').toUpperCase();
    if (!(formattedValue in WatchStatus)) {
      throw new BadRequestException(`Invalid WatchStatus: ${value}`);
    }
    return WatchStatus[formattedValue as keyof typeof WatchStatus];
  }

  async getWatchlistById(id: number): Promise<Watchlist> {
    try {
      const watchlist = await this.prisma.watchlist.findUnique({
        where: { id },
      });

      if (!watchlist) {
        throw new NotFoundException(`Watchlist entry not found for id ${id}.`);
      }

      return watchlist;
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async getWatchlistByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    watchlists: Watchlist[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0.');
    }
    const skip = (page - 1) * limit;
    try {
      const [watchlists, total] = await this.prisma.$transaction([
        this.prisma.watchlist.findMany({
          where: { userId },
          skip,
          take: limit,
        }),
        this.prisma.watchlist.count({ where: { userId } }),
      ]);

      return {
        watchlists,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async createWatchList(
    userId: number,
    data: CreateWatchlistDto,
  ): Promise<Watchlist> {
    try {
      if (!data.title || !data.type) {
        throw new BadRequestException('Title and type are required.');
      }

      let content = await this.prisma.content.findUnique({
        where: { title: data.title },
      });

      if (!content) {
        content = await this.prisma.content.create({
          data: {
            title: data.title,
            chapters: data.currentChap,
            type: this.getContentKey(data.type),
            episodes: data.currentEp,
          },
        });
      }

      return await this.prisma.watchlist.create({
        data: {
          userId,
          contentId: content.id,
          status: this.getStatusKey('watching'),
        },
      });
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async getAllWatchList(page: number = 1, limit: number = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0.');
    }

    const skip = (page - 1) * limit;

    try {
      const [watchlists, total] = await this.prisma.$transaction([
        this.prisma.watchlist.findMany({
          skip,
          take: limit,
          include: { user: true, content: true },
        }),
        this.prisma.watchlist.count(),
      ]);

      return {
        watchlists,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async deleteWatchListEntry(
    userId: number,
    contentId: number,
  ): Promise<string> {
    try {
      const watchlistEntry = await this.prisma.watchlist.findFirst({
        where: { userId, contentId },
      });

      if (!watchlistEntry) {
        throw new NotFoundException(
          `Watchlist entry not found for user ${userId} and content ${contentId}.`,
        );
      }

      await this.prisma.watchlist.delete({
        where: { id: watchlistEntry.id },
      });

      return 'The watchlist entry has been successfully deleted.';
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }
}
