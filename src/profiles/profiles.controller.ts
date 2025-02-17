import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProfileDto, UpdateProfileDto } from 'src/utils/Profile.dto';

@Controller('profiles')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  async create(@Body() data: CreateProfileDto): Promise<string> {
    return this.profilesService.createProfile(data.userId, data.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  async findAll(): Promise<Profile[]> {
    return this.profilesService.getAllProfiles();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a profile by userId' })
  async findOne(@Param('userId') id: string): Promise<string> {
    return this.profilesService.getProfileByUserId(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a profile' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.updateProfile(Number(id), data.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profile' })
  async delete(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.deleteProfile(Number(id));
  }
}
