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
import { UpdateContentDto } from 'src/utils/Content.dto';

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
        include: { content: true, user: true },
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
          include: { content: true, user: true },
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
            type: this.getContentKey(data.type),
            episodes: data.currentEp,
            chapters: data.currentChap,
          },
        });
      }

      return await this.prisma.watchlist.create({
        data: {
          userId,
          contentId: content.id,
          currentChap: content.chapters,
          currentEp: content.episodes,
          status: this.getStatusKey('watching'),
        },
        include: { content: true },
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

  async deleteWatchListEntry(userId: number, id: number): Promise<string> {
    try {
      const watchlistEntry = await this.prisma.watchlist.findFirst({
        where: { userId, id },
      });

      if (!watchlistEntry) {
        throw new NotFoundException(
          `Watchlist entry not found for user ${userId} and id ${id}.`,
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

  async updateWatchList(
    id: number,
    data: UpdateContentDto,
  ): Promise<Watchlist> {
    try {
      if (
        !data.title &&
        !data.type &&
        !data.currentChap &&
        !data.currentEp &&
        !data.status
      ) {
        throw new BadRequestException(
          'At least one field (title, type, currentChap, currentEp, status) is required to update.',
        );
      }

      const watchlistEntry = await this.prisma.watchlist.findUnique({
        where: { id },
        include: { content: true },
      });

      if (!watchlistEntry) {
        throw new NotFoundException(`Watchlist entry not found for id ${id}.`);
      }

      let content = watchlistEntry.content;

      if (data.title || data.type) {
        if (!content) {
          content = await this.prisma.content.create({
            data: {
              title: data.title || '',
              chapters: data.currentChap ?? 0,
              type: data.type ? this.getContentKey(data.type) : 'ANIME',
              episodes: data.currentEp ?? 0,
            },
          });
        } else {
          content = await this.prisma.content.update({
            where: { id: content.id },
            data: {
              title: data.title ?? content.title,
              chapters: data.currentChap ?? content.chapters,
              type: data.type ? this.getContentKey(data.type) : content.type,
              episodes: data.currentEp ?? content.episodes,
            },
          });
        }
      }

      const updatedWatchlist = await this.prisma.watchlist.update({
        where: { id },
        data: {
          contentId: content.id,
          status: data.status
            ? this.getStatusKey(data.status)
            : watchlistEntry.status,
          currentEp: data.currentEp ?? watchlistEntry.currentEp,
          currentChap: data.currentChap ?? watchlistEntry.currentChap,
        },
      });

      return updatedWatchlist;
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }
}
