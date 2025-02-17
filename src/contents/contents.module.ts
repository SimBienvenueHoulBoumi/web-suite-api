import { Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ContentsService, PrismaService],
  controllers: [ContentsController],
})
export class ContentsModule {}
