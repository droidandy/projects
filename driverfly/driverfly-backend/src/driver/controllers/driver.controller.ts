import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DriverService } from '../services/driver.service';
import { User } from '../../user/classes/user.decorator';
import { DriverEntity } from '../entities/driver.entity';
import { UpsertDriverDto } from '../dto/upsert-driver.dto';
import { UpsertDriverPreferenceDto } from '../dto/upsert-driver-preference.dto';

@ApiBearerAuth()
@ApiTags('driver')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async findByUser(@User('id') userId: number) {
    return await this.driverService.findByUserId(userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Post('')
  async update(@User('id') userId: number, @Body() dto: UpsertDriverDto) {
    return await this.driverService.createOrUpdate(userId, dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async findPreferences(@User('id') userId: number) {
    return await this.driverService.findPreferences(userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Post('preferences')
  async updatePreferences(
    @User('id') userId: number,
    @Body() dto: UpsertDriverPreferenceDto,
  ) {
    return await this.driverService.upsertPreference(userId, dto);
  }
}
