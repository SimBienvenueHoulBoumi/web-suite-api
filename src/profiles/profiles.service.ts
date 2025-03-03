import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Profile } from '@prisma/client';
import { ErrorHandler } from 'src/common/error-handler';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: number, name: string): Promise<string> {
    try {
      await this.prisma.profile.create({
        data: { name, userId },
      });
      return 'Profile created successfully';
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async getAllProfiles(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    profiles: Profile[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0.');
    }
    const skip = (page - 1) * limit;
    try {
      const [profiles, total] = await this.prisma.$transaction([
        this.prisma.profile.findMany({ skip, take: limit }),
        this.prisma.profile.count(),
      ]);
      return {
        profiles,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      ErrorHandler.handlePrismaError(error);
    }
  }

  async updateProfile(id: number, name: string): Promise<Profile> {
    try {
      return await this.prisma.profile.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      throw new NotFoundException(`Profile with id ${id} not found.`);
    }
  }

  async deleteProfile(id: number): Promise<string> {
    try {
      await this.prisma.profile.delete({ where: { id } });
      return 'Profile successfully deleted';
    } catch (error) {
      throw new NotFoundException(`Profile with id ${id} not found.`);
    }
  }

  async getProfileByUserId(userId: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }
}
