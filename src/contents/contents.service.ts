import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Content, ContentType, WatchStatus } from '@prisma/client';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async createContent(
    title: string,
    type: ContentType,
    status: WatchStatus,
    episodes?: number,
    chapters?: number,
  ): Promise<Content> {
    return this.prisma.content.create({
      data: {
        title,
        type,
        status,
        episodes,
        chapters,
      },
    });
  }

  async getAllContents(): Promise<Content[]> {
    return this.prisma.content.findMany();
  }

  async getContentById(id: number): Promise<Content | null> {
    return this.prisma.content.findUnique({
      where: { id },
    });
  }

  async updateContent(
    id: number,
    data: {
      title?: string;
      status?: WatchStatus;
      currentEp?: number;
      currentChap?: number;
    },
  ): Promise<Content> {
    return this.prisma.content.update({
      where: { id },
      data,
    });
  }

  async deleteContent(id: number): Promise<Content> {
    return this.prisma.content.delete({
      where: { id },
    });
  }
}
