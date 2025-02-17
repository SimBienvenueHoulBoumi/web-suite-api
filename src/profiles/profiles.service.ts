import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: number, name: string): Promise<string> {
    this.prisma.profile.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });

    return 'The profile has been successfully created.';
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      include: { user: true },
    });
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

  async getProfileByUserId(userId: number): Promise<string> {
    this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });
    return "Successfully fetched the profile."
  }
}
