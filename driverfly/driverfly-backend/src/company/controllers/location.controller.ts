import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../../user/entities/user.entity';
import { User } from '../../user/classes/user.decorator';
import { CompanyGuard } from '../guards/company.guard';
import { LocationService } from '../services/location.service';
import { UpsertLocationDto } from '../dto/upsert-location.dto';

@ApiTags('vehicles')
@Controller('companies/:companyId/locations/')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The location street specified already exists (duplicate)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The location was inserted successfully',
  })
  async create(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Body() dto: UpsertLocationDto,
  ) {
    return await this.locationService.create(user, companyId, dto);
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The location could not be found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The location was updated successfully',
  })
  async update(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpsertLocationDto,
  ) {
    return await this.locationService.update(user, companyId, id, dto);
  }

  @Get('/')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  async findAll(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
  ) {
    return await this.locationService.findAll(user, companyId);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  async findOne(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
  ) {
    return await this.locationService.findById(user, companyId, id);
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The location could not be found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The location was deleted successfully',
  })
  @Delete(':id')
  async remove(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
  ) {
    return await this.locationService.delete(user, companyId, id);
  }
}
