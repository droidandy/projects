import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

import { asyncForEach, asyncMap, safeAssign } from '../../shared/utils';

import { UserEntity } from '../../user/entities/user.entity';
import { CompanyEntity } from '../../user/entities/company.entity';

import DocumentUploadService from './document.service';

import { ApplicationRepository } from '../repositories/application.repository';

import { LocationService, VehicleService } from '../../company/services';
import { LocationEntity, VehicleEntity } from '../../company/entities';

import {
  ApplicationEntity,
  JobCriminalEntity,
  JobEntity,
  JobMvrEntity,
  JobSkillEntity,
} from '../entities';
import {
  CreateApplicationDto,
  UpsertJobCriminalDto,
  UpsertJobDto,
  UpsertJobMvrDto,
  UpsertJobSkillDto,
} from '../dto';
import {
  JobsRepository,
  JobSkillRepository,
  JobMvrRepository,
  JobCriminalRepository,
} from '../repositories';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobsRepository)
    private readonly jobsRepository: JobsRepository,
    @InjectRepository(JobCriminalRepository)
    private readonly jobCriminalRepository: JobCriminalRepository,
    @InjectRepository(JobMvrRepository)
    private readonly jobMvrRepository: JobMvrRepository,
    @InjectRepository(JobSkillRepository)
    private readonly jobSkillsRepository: JobSkillRepository,

    private readonly applicationRepository: ApplicationRepository,
    private readonly documentUploadService: DocumentUploadService,

    private readonly locationService: LocationService,
    private readonly vehicleService: VehicleService,
  ) {}

  private assignJobSafe(entity: JobEntity, dto: UpsertJobDto) {
    safeAssign(dto, entity, [
      'title',
      'description',
      'description_short',
      'drivers_needed',
      'expiry_date',
      'geography',
      'schedule',
      'employment_type',
      'equipment_type',
      'delivery_type',
      'team_drivers',
      'pay_methods',
      'min_rate',
      'max_rate',
      'min_miles',
      'max_miles',
      'min_weekly_pay',
      'max_weekly_pay',
      'benefits',
      'benefits_other',
      'cdl_class',
      'min_years_experience',
      'min_degree',
      'required_skills_other',
      'required_equipment',
      'required_endorsement',
      'transmission_type_experience',
      'max_applicant_radius',
      'must_pass_drug_test',
      'must_have_clean_mvr',
      'accept_sap_graduates',
      'max_accidents',
      'safety_requirements_other',
    ]);
  }

  async create(user: UserEntity, companyId: number, dto: UpsertJobDto) {
    let entity: JobEntity = new JobEntity();
    entity.company = new CompanyEntity(companyId);

    return await this.upsert(user, entity, dto);
  }

  async update(
    user: UserEntity,
    companyId: number,
    id: number,
    dto: UpsertJobDto,
  ) {
    const company: CompanyEntity = new CompanyEntity(companyId);
    let entity: JobEntity = await this.jobsRepository.findOne({
      company: company,
      id: id,
    });

    if (!entity)
      throw new HttpException(
        { errors: 'Unable to find job entity' },
        HttpStatus.NOT_FOUND,
      );

    entity.company = company;

    return await this.upsert(user, entity, dto);
  }

  private async upsert(user: UserEntity, entity: JobEntity, dto: UpsertJobDto) {
    entity.location = await this.locationService.findOrCreate(
      user,
      entity.company.id,
      dto.location?.id,
      dto.location,
    );

    if (dto.vehicles != null) {
      entity.vehicles = await asyncMap(dto.vehicles, async (v, i) => {
        if (v.id != null) {
          const vehicle: VehicleEntity = await this.vehicleService.findById(
            user,
            entity.company.id,
            v.id,
          );

          if (!vehicle)
            throw new HttpException(
              { errors: `vehicle at index ${i} was not found` },
              HttpStatus.NOT_FOUND,
            );

          return vehicle;
        }

        return await this.vehicleService.create(user, entity.company.id, v);
      });
    }

    this.assignJobSafe(entity, dto);

    entity = await this.jobsRepository.save(entity);

    if (entity.id == null) throw new Error('Unable to save entity');

    entity.required_skills = await this.upsertJobSkills(
      entity,
      dto.required_skills,
    );

    entity.mvr_requirements = await this.upsertJobMvr(
      entity,
      dto.mvr_requirements,
    );

    entity.criminal_history = await this.upsertJobCriminal(
      entity,
      dto.criminal_history,
    );

    return entity;
  }

  private assignJobSkillSafe(entity: JobSkillEntity, dto: UpsertJobSkillDto) {
    safeAssign(dto, entity, ['type', 'years']);
  }

  private pruneJobSkill(entity: JobSkillEntity) {
    delete entity.id;
    delete entity.job;
  }

  private async upsertJobSkills(job: JobEntity, dtos: UpsertJobSkillDto[]) {
    if (dtos?.length === 0) {
      await this.jobSkillsRepository.delete({ job });
      return [];
    }

    let entities: JobSkillEntity[] = await this.jobSkillsRepository.find({
      job,
    });

    if (dtos != null) {
      await asyncForEach(entities, async (entity) => {
        if (dtos.findIndex((dto) => dto.type === entity.type) < 0) {
          await this.jobSkillsRepository.delete(entity);
        }
      });

      entities = await asyncMap(dtos, async (dto) => {
        let entity = entities.find((e) => e.type === dto.type);

        if (!entity) {
          entity = new JobSkillEntity();
          entity.job = new JobEntity(job.id);
        }

        this.assignJobSkillSafe(entity, dto);

        return await this.jobSkillsRepository.save(entity);
      });
    }

    entities.forEach(this.pruneJobSkill);

    return entities;
  }

  private assignJobMvrSafe(entity: JobMvrEntity, dto: UpsertJobMvrDto) {
    safeAssign(dto, entity, ['type', 'max_count', 'max_years']);
  }

  private pruneJobMvr(entity: JobMvrEntity) {
    delete entity.id;
    delete entity.job;
  }

  private async upsertJobMvr(job: JobEntity, dtos: UpsertJobMvrDto[]) {
    if (dtos?.length === 0) {
      await this.jobMvrRepository.delete({ job });
      return [];
    }

    let entities: JobMvrEntity[] = await this.jobMvrRepository.find({ job });

    if (dtos != null) {
      await asyncForEach(entities, async (entity) => {
        if (dtos.findIndex((dto) => dto.type === entity.type) < 0) {
          await this.jobMvrRepository.delete(entity);
        }
      });

      entities = await asyncMap(dtos, async (dto) => {
        let entity = entities.find((e) => e.type === dto.type);

        if (!entity) {
          entity = new JobMvrEntity();
          entity.job = new JobEntity(job.id);
        }

        this.assignJobMvrSafe(entity, dto);

        return await this.jobMvrRepository.save(entity);
      });
    }

    entities.forEach(this.pruneJobMvr);

    return entities;
  }

  private assignJobCriminalSafe(
    entity: JobCriminalEntity,
    dto: UpsertJobCriminalDto,
  ) {
    safeAssign(dto, entity, ['type', 'max_years']);
  }

  private pruneJobCriminal(entity: JobCriminalEntity) {
    delete entity.id;
    delete entity.job;
  }

  private async upsertJobCriminal(
    job: JobEntity,
    dtos: UpsertJobCriminalDto[],
  ) {
    if (dtos?.length === 0) {
      await this.jobCriminalRepository.delete({ job });
      return [];
    }

    let entities: JobCriminalEntity[] = await this.jobCriminalRepository.find({
      job,
    });

    if (dtos != null) {
      await asyncForEach(entities, async (entity) => {
        if (dtos.findIndex((dto) => dto.type === entity.type) < 0) {
          await this.jobCriminalRepository.delete(entity);
        }
      });

      entities = await asyncMap(dtos, async (dto) => {
        let entity = entities.find((e) => e.type === dto.type);

        if (!entity) {
          entity = new JobCriminalEntity();
          entity.job = new JobEntity(job.id);
        }

        this.assignJobCriminalSafe(entity, dto);

        return await this.jobCriminalRepository.save(entity);
      });
    }

    entities.forEach(this.pruneJobCriminal);

    return entities;
  }

  async findByCompanyId(user: UserEntity, companyId: number) {
    return await this.jobsRepository.find({
      company: new CompanyEntity(companyId),
    });
  }

  async findById(
    user: UserEntity,
    companyId: number,
    id: number,
  ): Promise<JobEntity> {
    return await this.jobsRepository.findOne({
      company: new CompanyEntity(companyId),
      id: id,
    });
  }

  async remove(user: UserEntity, companyId: number, id: number) {
    return await this.jobsRepository.delete({
      company: new CompanyEntity(companyId),
      id: id,
    });
  }

  // public APIs
  // APIs which do not require authorization may need private data pruned
  findAll(req) {
    console.log(req.query);
    const jobs = this.jobsRepository.createQueryBuilder('jobs');
    if (req.query.title) {
      jobs.where('jobs.title LIKE :title', {
        title: `%${req.query.keywords}%`,
      });
    }
    if (req.query.category) {
      jobs.where('jobs.category LIKE :category', {
        category: `%${req.query.category}%`,
      });
    }

    if (req.query.location) {
      jobs.where('jobs.location LIKE :location', {
        location: `%${req.query.location}%`,
      });
    }

    if (req.query.work_type) {
      jobs.where('jobs.work_type LIKE :work_type', {
        work_type: `%${req.query.work_type}%`,
      });
    }

    if (req.query.job_type) {
      jobs.where('jobs.job_type LIKE :job_type', {
        job_type: `%${req.query.job_type}%`,
      });
    }

    if (req.query.areas_covered) {
      jobs.where('jobs.areas_covered LIKE :areas_covered', {
        areas_covered: `%${req.query.areas_covered}%`,
      });
    }

    if (req.query.employment_type) {
      jobs.where('jobs.employment_type LIKE :employment_type', {
        employment_type: `%${req.query.employment_type}%`,
      });
    }

    if (req.query.delivery_type) {
      jobs.where('jobs.delivery_type LIKE :delivery_type', {
        delivery_type: `%${req.query.delivery_type}%`,
      });
    }

    if (req.query.drivers_from) {
      jobs.where('jobs.drivers_from LIKE :drivers_from', {
        drivers_from: `%${req.query.drivers_from}%`,
      });
    }

    if (req.query.equipment_type) {
      jobs.where('jobs.equipment_type LIKE :equipment_type', {
        equipment_type: `%${req.query.equipment_type}%`,
      });
    }

    if (req.query.schedule) {
      jobs.where('jobs.schedule LIKE :schedule', {
        schedule: `%${req.query.schedule}%`,
      });
    }

    if (req.query.pay_structure) {
      jobs.where('jobs.pay_structure LIKE :pay_structure', {
        pay_structure: `%${req.query.pay_structure}%`,
      });
    }

    if (req.query.pay_structure) {
      jobs.where('jobs.pay_structure LIKE :pay_structure', {
        pay_structure: `%${req.query.pay_structure}%`,
      });
    }

    if (req.query.endoresements_type) {
      jobs.where('jobs.endoresements_type LIKE :endoresements_type', {
        endoresements_type: `%${req.query.endoresements_type}%`,
      });
    }

    if (req.query.mvr_requirements) {
      jobs.where('jobs.mvr_requirements LIKE :mvr_requirements', {
        mvr_requirements: `%${req.query.mvr_requirements}%`,
      });
    }

    return jobs.getMany();
  }

  async findOne(id: number) {
    return await this.jobsRepository.findOne({ id: id });
  }

  /**
   *
   * @param id
   * @param files
   * @param createApplicationDto
   * @param req
   * @returns
   */
  async apply(
    id: number,
    files,
    createApplicationDto: CreateApplicationDto,
    req,
  ): Promise<ApplicationEntity> {
    const job = await this.jobsRepository.findOne(id);
    if (!job) {
      throw new NotFoundException('Job does not exist!');
    }

    if (files.resume) {
      createApplicationDto.resume = await this.documentUploadService.upload(
        'resume',
        files.resume[0],
      );
    }

    if (files.commercial_driving_license) {
      createApplicationDto.commercial_driving_license =
        await this.documentUploadService.upload(
          'resume',
          files.commercial_driving_license[0],
        );
    }

    if (files.medical_card) {
      createApplicationDto.medical_card =
        await this.documentUploadService.upload(
          'medical_card',
          files.medical_card[0],
        );
    }

    const application = new ApplicationEntity();
    application.job = job;
    if (req.body.userId) {
      const user = await getRepository(UserEntity).findOne(req.body.userId);
      createApplicationDto.user = user;
    }
    const created = Object.assign(application, createApplicationDto);

    return this.applicationRepository.save(created);
  }

  /**
   *
   * @param userId
   * @returns
   */
  appliedJobs(userId: number) {
    return this.applicationRepository.find({
      where: [
        {
          user: userId,
        },
      ],
      relations: ['job'],
    });
  }
}
