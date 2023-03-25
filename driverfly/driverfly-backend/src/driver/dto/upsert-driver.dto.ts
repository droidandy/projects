import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { DriverDegree } from '../classes/driver-degree.enum';
import { DriverLicenseType } from '../classes/driver-license-type.enum';
import { UpsertDriverEmploymentDto } from './upsert-driver-employment.dto';
import { UpsertDriverEquipmentDto } from './upsert-driver-equipment.dto';
import { UpsertDriverSafetyQuestionDto } from './upsert-driver-safety-question.dto';

export class UpsertDriverDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthdate?: string;

  @ApiProperty()
  @IsOptional()
  street?: string;

  @ApiProperty()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsOptional()
  zip_code?: string;

  // driver license
  @ApiProperty()
  @IsOptional()
  license_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  license_expiry?: string;

  @ApiProperty()
  @IsOptional()
  license_state?: string;

  @ApiProperty()
  @IsOptional()
  license_type?: DriverLicenseType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  years_cdl_experience?: number;

  @ApiProperty({
    type: [UpsertDriverEquipmentDto],
  })
  @IsOptional()
  @Type(() => UpsertDriverEquipmentDto)
  equipment_experience?: UpsertDriverEquipmentDto[];

  // education
  @ApiProperty()
  @IsOptional()
  highest_degree?: DriverDegree;

  // emergency contact
  @ApiProperty()
  @IsOptional()
  emergency_contact_name?: string;

  @ApiProperty()
  @IsOptional()
  // @IsPhoneNumber()
  emergency_contact_number?: string;

  @ApiProperty()
  @IsOptional()
  emergency_contact_relationship?: string;

  // past employment
  @ApiProperty()
  @IsOptional()
  employers?: UpsertDriverEmploymentDto[];

  // safety background
  @ApiProperty()
  @IsOptional()
  can_pass_drug_test: boolean;

  @ApiProperty()
  @IsOptional()
  has_past_dui: boolean;

  @ApiProperty()
  @IsOptional()
  dui_years?: string[];

  @ApiProperty()
  @IsOptional()
  criminal_history?: string;

  @ApiProperty()
  @IsOptional()
  accident_count?: number;

  @ApiProperty()
  @IsOptional()
  accident_details?: string;

  @ApiProperty()
  @IsOptional()
  safety_questions?: UpsertDriverSafetyQuestionDto[];
}
