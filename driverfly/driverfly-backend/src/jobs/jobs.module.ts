import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';

import { JobsService } from './services/jobs.service';
import { CompanyJobsController } from './controllers/company-jobs.controller';
import { JobsController } from './controllers/jobs.controller';

import {
  ApplicationRepository,
  JobCriminalRepository,
  JobMvrRepository,
  JobSkillRepository,
  JobsRepository,
} from './repositories';

import {
  ApplicationEntity,
  JobCriminalEntity,
  JobEntity,
  JobMvrEntity,
  JobSkillEntity,
} from './entities';

import DocumentUploadService from './services/document.service';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    TypeOrmModule.forFeature([
      JobEntity,
      JobCriminalEntity,
      JobMvrEntity,
      JobSkillEntity,

      JobsRepository,
      JobCriminalRepository,
      JobMvrRepository,
      JobSkillRepository,

      ApplicationEntity,
      ApplicationRepository,
    ]),
  ],
  controllers: [CompanyJobsController, JobsController],
  providers: [JobsService, DocumentUploadService],
  exports: [DocumentUploadService, JobsService],
})
export class JobsModule {}
