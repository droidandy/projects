import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { UpsertJobDto } from '../dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import fs = require('fs');

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  findAll(@Req() req: any) {
    return this.jobsService.findAll(req);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Post('apply/:id')
  // @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'resume',
        maxCount: 1,
      },
      {
        name: 'commercial_driving_license',
        maxCount: 1,
      },
      {
        name: 'medical_card',
        maxCount: 1,
      },
    ]),
  )
  apply(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File;
      commercial_driving_license?: Express.Multer.File;
      medical_card?: Express.Multer.File;
    },
    @Body()
    createApplicationDto: CreateApplicationDto,
    @Req() req,
  ) {
    return this.jobsService.apply(+id, files, createApplicationDto, req);
  }

  /**
   *
   * Apply for a job if user is logged in
   *
   * @param id
   * @param files
   * @param createApplicationDto
   * @param req
   * @returns
   */

  @Post('applications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'resume',
        maxCount: 1,
      },
      {
        name: 'commercial_driving_license',
        maxCount: 1,
      },
      {
        name: 'medical_card',
        maxCount: 1,
      },
    ]),
  )
  userApply(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File;
      commercial_driving_license?: Express.Multer.File;
      medical_card?: Express.Multer.File;
    },
    @Body()
    createApplicationDto: CreateApplicationDto,
    @Req() req,
  ) {
    console.log(req);
    return this.jobsService.apply(+id, files, createApplicationDto, req);
  }

  @Get('/applications/user')
  @UseGuards(JwtAuthGuard)
  applications(@Req() req: any) {
    console.log(req.user);

    return this.jobsService.appliedJobs(+req.user.userId);
  }
}
