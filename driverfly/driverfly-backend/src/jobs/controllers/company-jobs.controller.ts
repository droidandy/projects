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
import { JobsService } from '../services/jobs.service';
import { UpsertJobDto } from '../dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../../company/guards/company.guard';
import { User } from '../../user/classes/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';

@ApiTags('jobs')
@Controller('companies/:companyId/jobs')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class CompanyJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The job has been created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not allowed to access this company.',
  })
  async create(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Body() dto: UpsertJobDto,
  ) {
    return await this.jobsService.create(user, companyId, dto);
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The job has been updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not allowed to access this company.',
  })
  async update(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpsertJobDto,
  ) {
    return await this.jobsService.update(user, companyId, id, dto);
  }

  @Get('/')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  async findByCompanyId(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
  ) {
    return await this.jobsService.findByCompanyId(user, companyId);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  async findById(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id?: number,
  ) {
    return await this.jobsService.findById(user, companyId, id);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The job has been deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have permission to access the company',
  })
  remove(
    @User() user: UserEntity,
    @Param('companyId') companyId: number,
    @Param('id') id: number,
  ) {
    return this.jobsService.remove(user, companyId, id);
  }
}
