import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: number, name: string): Promise<string> {
    const profile = await this.prisma.profile.create({
      data: {
        name: name,
        userId: userId,
      },
      include: { user: true },
    });

    return 'Profile created successfully';
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.prisma.profile.findMany();
  }

  async updateProfile(id: number, name: string): Promise<Profile> {
    return this.prisma.profile.update({
      where: { id },
      data: { name },
    });
  }

  async deleteProfile(id: number): Promise<Profile> {
    return this.prisma.profile.delete({
      where: { id },
    });
  }

  async getProfileByUserId(userId: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }
}
