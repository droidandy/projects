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
import { VehicleService } from '../services/vehicle.service';
import { UpsertVehicleDto } from '../dto/upsert-vehicle.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { User } from '../../user/classes/user.decorator';
import { CompanyGuard } from '../guards/company.guard';

@ApiTags('vehicles')
@Controller('companies/:companyId/vehicles/')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vehicle was inserted successfully',
  })
  async create(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Body() dto: UpsertVehicleDto,
  ) {
    return await this.vehicleService.create(user, companyId, dto);
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The vehicle could not be found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vehicle was updated successfully',
  })
  async update(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpsertVehicleDto,
  ) {
    return await this.vehicleService.update(user, companyId, id, dto);
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
    return await this.vehicleService.findAll(user, companyId);
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
    return await this.vehicleService.findById(user, companyId, id);
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The vehicle could not be found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vehicle was deleted successfully',
  })
  @Delete(':id')
  async remove(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
  ) {
    return await this.vehicleService.delete(user, companyId, id);
  }
}
