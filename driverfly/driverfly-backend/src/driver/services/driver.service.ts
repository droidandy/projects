import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { DriverEmploymentEntity } from '../entities/driverEmployment.entity';
import { DriverEmploymentRepository } from '../repositories/driverEmployment.repository';
import { DriverEquipmentEntity } from '../entities/driverEquipment.entity';
import { DriverEquipmentRepository } from '../repositories/driverEquipment.repository';
import { DriverSafetyQuestionEntity } from '../entities/driverSafetyQuestion.entity';
import { DriverSafetyQuestionRepository } from '../repositories/driverSafetyQuestion.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { DriverEntity } from '../entities/driver.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UpsertDriverDto } from '../dto/upsert-driver.dto';
import { UpsertDriverEmploymentDto } from '../dto/upsert-driver-employment.dto';
import { UpsertDriverEquipmentDto } from '../dto/upsert-driver-equipment.dto';
import { UpsertDriverSafetyQuestionDto } from '../dto/upsert-driver-safety-question.dto';
import { safeAssign } from '../../shared/utils';
import { DriverPreferenceEntity } from '../entities/driverPreference.entity';
import { UpsertDriverPreferenceDto } from '../dto/upsert-driver-preference.dto';
import { DriverPreferenceRepository } from '../repositories/driverPreference.repository';
import { GeoService } from 'src/geo/services/geo.service';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: DriverRepository,

    @InjectRepository(DriverEmploymentEntity)
    private readonly driverEmploymentRepository: DriverEmploymentRepository,

    @InjectRepository(DriverEquipmentEntity)
    private readonly driverEquipmentRepository: DriverEquipmentRepository,

    @InjectRepository(DriverPreferenceEntity)
    private readonly driverPreferenceRepository: DriverPreferenceRepository,

    @InjectRepository(DriverSafetyQuestionEntity)
    private readonly driverSafetyQuestionRepository: DriverSafetyQuestionRepository,

    private readonly geoService: GeoService,
  ) {}

  async findByUserId(userId: number) {
    const user = new UserEntity(userId);
    const driver = await this.driverRepository.findOne({ user });

    if (driver) {
      driver.employers = await this.findEmployers(driver);
      driver.equipment_experience = await this.findEquipment(driver);
      driver.safety_questions = await this.findSafetyQuestions(driver);
    }

    return driver;
  }

  private async findEmployers(driver: DriverEntity) {
    return await this.driverEmploymentRepository.find({ driver });
  }

  private async findEquipment(driver: DriverEntity) {
    return await this.driverEquipmentRepository.find({ driver });
  }

  private async findSafetyQuestions(driver: DriverEntity) {
    return await this.driverSafetyQuestionRepository.find({ driver });
  }

  private assignDriverSafe(entity: DriverEntity, dto: UpsertDriverDto) {
    safeAssign(dto, entity, [
      'birthdate',
      'street',
      'city',
      'state',
      'zip_code',
      'license_number',
      'license_expiry',
      'license_state',
      'license_type',
      'years_cdl_experience',
      'highest_degree',
      'emergency_contact_name',
      'emergency_contact_number',
      'emergency_contact_relationship',
      'can_pass_drug_test',
      'has_past_dui',
      'dui_years',
      'criminal_history',
      'accident_count',
      'accident_details',
    ]);
  }

  private assignDriverEmploymentSafe(
    entity: DriverEmploymentEntity,
    dto: UpsertDriverEmploymentDto,
  ) {
    safeAssign(dto, entity, [
      'name',
      'start_at',
      'end_at',
      'title',
      'address',
      'street',
      'city',
      'state',
      'state',
      'zip_code',
      'phone',
      'can_contact',
      'is_subject_to_fmcsrs',
      'is_subject_to_drug_tests',
    ]);
  }

  private assignDriverEquipmentSafe(
    entity: DriverEquipmentEntity,
    dto: UpsertDriverEquipmentDto,
  ) {
    safeAssign(dto, entity, ['type', 'years']);
  }

  private assignDriverSafetyQuestionSafe(
    entity: DriverSafetyQuestionEntity,
    dto: UpsertDriverSafetyQuestionDto,
  ) {
    safeAssign(dto, entity, ['type', 'response', 'details']);
  }

  private assignDriverPreferenceSafe(
    entity: DriverPreferenceEntity,
    dto: UpsertDriverPreferenceDto,
  ) {
    safeAssign(dto, entity, ['category', 'label', 'value']);
  }

  async createOrUpdate(userId: number, dto: UpsertDriverDto) {
    let driver = await this.findByUserId(userId);

    if (!driver) {
      driver = new DriverEntity();
      driver.user = new UserEntity(userId);

      driver.employers = [];
      driver.equipment_experience = [];
      driver.safety_questions = [];
    }

    this.assignDriverSafe(driver, dto);

    // perform forward geocoding
    await this.geoService.forwardGeocodeAndSet(driver);
    
    driver = await this.driverRepository.save(driver);

    if (driver.id == null) throw new Error('Unable to save driver');

    if (dto.employers != null) {
      // delete all
      if (dto.employers.length == 0) {
        await this.driverEmploymentRepository.delete({ driver });
        driver.employers = [];
      } else {
        for (let i = 0; i < driver.employers.length; i++) {
          let employer = driver.employers[i];

          const employerDto = dto.employers.find((v) => v.id === employer.id);

          if (employerDto == null)
            await this.driverEmploymentRepository.delete({ id: employer.id });
          else {
            this.assignDriverEmploymentSafe(employer, employerDto);

            employer = await this.driverEmploymentRepository.save(employer);
          }
        }

        for (let i = 0; i < dto.employers.length; i++) {
          const employerDto = dto.employers[i];

          if (employerDto.id == null) {
            let employer = new DriverEmploymentEntity();
            employer.driver = driver;

            this.assignDriverEmploymentSafe(employer, employerDto);

            employer = await this.driverEmploymentRepository.save(employer);
            employerDto.id = employer.id;
          }
        }

        driver.employers = dto.employers.map((dto) => {
          const entity = new DriverEmploymentEntity();
          this.assignDriverEmploymentSafe(entity, dto);
          return entity;
        });
      }
    } else driver.employers.forEach((v) => (v.driver = null));

    driver.equipment_experience = await this.upsertEquipmentExperience(
      driver,
      dto.equipment_experience,
    );

    if (dto.safety_questions != null) {
      for (let i = 0; i < driver.safety_questions.length; i++) {
        let safetyQuestion = driver.safety_questions[i];
        safetyQuestion.driver = driver;

        const questionDto = dto.safety_questions.find(
          (v) => v.type === safetyQuestion.type,
        );

        if (questionDto == null) {
          await this.driverSafetyQuestionRepository.delete({
            id: safetyQuestion.id,
          });
        } else {
          this.assignDriverSafetyQuestionSafe(safetyQuestion, questionDto);

          safetyQuestion = await this.driverSafetyQuestionRepository.save(
            safetyQuestion,
          );
        }
      }

      for (let i = 0; i < dto.safety_questions.length; i++) {
        const questionDto = dto.safety_questions[i];

        if (
          driver.safety_questions.findIndex((v) => v.type == questionDto.type) <
          0
        ) {
          let safetyQuestion = new DriverSafetyQuestionEntity();
          safetyQuestion.driver = driver;
          this.assignDriverSafetyQuestionSafe(safetyQuestion, questionDto);

          safetyQuestion = await this.driverSafetyQuestionRepository.save(
            safetyQuestion,
          );
        }
      }

      driver.safety_questions = dto.safety_questions.map((dto) => {
        const entity = new DriverSafetyQuestionEntity();
        this.assignDriverSafetyQuestionSafe(entity, dto);

        return entity;
      });
    }
    driver.safety_questions.forEach((v) => (v.driver = null));

    return driver;
  }

  private pruneEquipment(entity: DriverEquipmentEntity) {
    if (!entity) return;

    delete entity.id;
    delete entity.driver;
    delete entity.created_at;
    delete entity.last_updated_at;
  }
  private async upsertEquipmentExperience(
    driver: DriverEntity,
    dtos: UpsertDriverEquipmentDto[],
  ) {
    const repository = this.driverEquipmentRepository;

    let entities = await this.findEquipment(driver);

    if (dtos == null) {
      entities.forEach(this.pruneEquipment);
      return entities;
    }

    if (dtos.length == 0) {
      await repository.delete({ driver });
      return [];
    }

    // run updates
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];

      const dto = dtos.find((v) => v.type === entity.type);

      if (dto == null) {
        await repository.delete({ id: entity.id });
      } else {
        this.assignDriverEquipmentSafe(entity, dto);

        entity = await repository.save(entity);
      }
    }

    // run inserts
    for (let i = 0; i < dtos.length; i++) {
      const dto = dtos[i];

      if (entities.findIndex((v) => v.type == dto.type) < 0) {
        let entity = new DriverEquipmentEntity();
        entity.driver = driver;

        this.assignDriverEquipmentSafe(entity, dto);

        console.log('Creating DriverEquipment');
        entity = await repository.save(entity);
      }
    }

    return dtos.map((dto) => {
      const entity = new DriverEquipmentEntity();
      this.assignDriverEquipmentSafe(entity, dto);
      return entity;
    });
  }

  async findPreferences(userId: number) {
    const driver = await this.findByUserId(userId);

    if (!driver) return [];

    return await this.driverPreferenceRepository.find({ driver });
  }

  async upsertPreference(userId: number, dto: UpsertDriverPreferenceDto) {
    let driver = await this.findByUserId(userId);

    if (!driver) {
      driver = new DriverEntity();
      driver.user = new UserEntity();
      driver.user.id = userId;

      driver = await this.driverRepository.save(driver);
    }

    let entity: DriverPreferenceEntity =
      await this.driverPreferenceRepository.findOne({
        driver,
        category: dto.category,
        label: dto.label,
      });

    if (!entity) {
      entity = new DriverPreferenceEntity();
      entity.driver = driver;
    }

    this.assignDriverPreferenceSafe(entity, dto);

    entity = await this.driverPreferenceRepository.save(entity);
    delete entity.driver;

    return entity;
  }
}
