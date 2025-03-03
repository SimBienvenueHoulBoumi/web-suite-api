import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateProfileDto, UpdateProfileDto } from 'src/utils/Profile.dto';

@Controller('profiles')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  async create(
    @Req() request: Request,
    @Body() data: CreateProfileDto,
  ): Promise<string> {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.profilesService.createProfile(user.sub, data.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.profilesService.getAllProfiles(Number(page), Number(limit));
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a profile by userId' })
  async findOne(@Param('userId') id: string): Promise<Profile | null> {
    const profile = await this.profilesService.getProfileByUserId(Number(id));
    if (!profile) {
      throw new NotFoundException(`Profile not found for userId ${id}.`);
    }
    return profile;
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
  async delete(@Param('id') id: string): Promise<string> {
    return this.profilesService.deleteProfile(Number(id));
  }
}
