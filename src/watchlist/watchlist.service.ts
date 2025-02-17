import { Injectable } from '@nestjs/common';
import { Watchlist } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async createWatchList(userId: number, contentId: number): Promise<string> {
    await this.prisma.watchlist.create({
      data: {
        user: { connect: { id: userId } },
        content: { connect: { id: contentId } },
      },
    });
    return 'The watchlist entry has been successfully created.';
  }

  async getAllWatchList(): Promise<Watchlist[]> {
    return this.prisma.watchlist.findMany({
      include: { user: true, content: true },
    });
  }

  async getWatchlistByUser(userId: number): Promise<Watchlist[]> {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: { content: true },
    });
  }

  async getWatchlistEntry(
    userId: number,
    contentId: number,
  ): Promise<Watchlist | null> {
    return this.prisma.watchlist.findFirst({
      where: { userId, contentId },
      include: { content: true },
    });
  }

  async getWatchlistById(id: number): Promise<Watchlist | null> {
    return this.prisma.watchlist.findFirst({
      where: { id: id },
      include: { content: true },
    });
  }

  async deleteWatchListEntry(
    userId: number,
    contentId: number,
  ): Promise<string> {
    const watchlistEntry = await this.prisma.watchlist.findFirst({
      where: { userId, contentId },
    });

    if (!watchlistEntry) {
      return 'Watchlist entry not found.';
    }

    await this.prisma.watchlist.delete({
      where: { id: watchlistEntry.id },
    });

    return 'The watchlist entry has been successfully deleted.';
  }
}
