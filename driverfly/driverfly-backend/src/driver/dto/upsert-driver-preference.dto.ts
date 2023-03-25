import { ApiProperty } from '@nestjs/swagger';
import {
  isArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { enumerateEnum } from '../../shared/utils';
import { DriverPreferenceCategory } from '../entities/driverPreference.entity';
import {
  ValidateLabelByCategory,
  ValidateValueByCategoryAndLabel,
} from '../classes/validate-driver-preferences.decorator';

export class UpsertDriverPreferenceDto {
  @ApiProperty()
  @IsEnum(DriverPreferenceCategory)
  category: DriverPreferenceCategory;

  @ApiProperty()
  @ValidateLabelByCategory('category')
  label: string;

  @ApiProperty()
  @ValidateValueByCategoryAndLabel('category', 'label')
  @IsOptional()
  value: string;
}
