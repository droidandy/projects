import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsCurrency,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DriverDegree } from '../../driver/classes/driver-degree.enum';
import { DriverLicenseType } from '../../driver/classes/driver-license-type.enum';
import { JobBenefits } from '../classes/job-benefits.enum';
import { JobGeography } from '../classes/job-geography.enum';
import { JobPayMethod } from '../classes/job-pay-method.enum';
import { JobTeamDriver } from '../classes/job-team-driver.enum';
import { JobType } from '../classes/job-type.enum';
import { UpsertJobCriminalDto } from './upsert-job-criminal.dto';
import { UpsertJobLocationDto } from './upsert-job-location.dto';
import { UpsertJobMvrDto } from './upsert-job-mvr.dto';
import { UpsertJobSkillDto } from './upsert-job-skill.dto';
import { UpsertJobVehicleDto } from './upsert-job-vehicle.dto';

export class UpsertJobDto {
  @ApiProperty()
  //@IsNotEmptyObject({ nullable: false })
  @ValidateNested({ always: true })
  @Type((t) => UpsertJobLocationDto)
  @IsDefined()
  location: UpsertJobLocationDto;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  description_short?: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  drivers_needed?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  expiry_date?: Date;

  @ApiProperty()
  @IsEnum(JobGeography)
  @IsOptional()
  geography?: JobGeography;

  @ApiProperty()
  @IsOptional()
  schedule?: string;

  @ApiProperty()
  @IsEnum(JobType)
  @IsOptional()
  employment_type?: JobType;

  @ApiProperty()
  @IsOptional()
  equipment_type?: string;

  @ApiProperty()
  @IsOptional()
  delivery_type?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(JobTeamDriver)
  team_drivers?: JobTeamDriver;

  @ApiProperty()
  @IsOptional()
  @IsEnum(JobPayMethod, { each: true })
  @ArrayUnique()
  pay_methods?: JobPayMethod[];

  @ApiProperty()
  @IsOptional()
  @IsCurrency()
  min_rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsCurrency()
  max_rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  min_miles?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  max_miles?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  min_weekely_pay?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  max_weekely_pay?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(JobBenefits, { each: true })
  @ArrayUnique()
  benefits?: JobBenefits[];

  @ApiProperty()
  @IsOptional()
  benefits_other?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type((t) => UpsertJobVehicleDto)
  vehicles?: UpsertJobVehicleDto[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(DriverLicenseType, { each: true })
  @ArrayUnique()
  cdl_class?: DriverLicenseType[];

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  min_years_experience?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(DriverDegree)
  min_degree?: DriverDegree;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type((t) => UpsertJobSkillDto)
  required_skills?: UpsertJobSkillDto[];

  @ApiProperty()
  @IsOptional()
  required_skills_other?: string;

  @ApiProperty()
  @IsOptional()
  @ArrayUnique()
  required_equipment?: string[];

  @ApiProperty()
  @IsOptional()
  @ArrayUnique()
  required_endorsement?: string[];

  @ApiProperty()
  @IsOptional()
  transmission_type_experience?: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  max_applicant_radius?: number;

  @ApiProperty()
  @IsOptional()
  must_pass_drug_test?: boolean;

  @ApiProperty()
  @IsOptional()
  must_have_clean_mvr?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type((t) => UpsertJobMvrDto)
  mvr_requirements?: UpsertJobMvrDto[];

  @ApiProperty()
  @IsOptional()
  accept_sap_graduates?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type((t) => UpsertJobCriminalDto)
  criminal_history?: UpsertJobCriminalDto[];

  @ApiProperty()
  @IsOptional()
  @Min(0)
  max_accidents?: number;

  @ApiProperty()
  @IsOptional()
  safety_requirements_other?: string;
}
