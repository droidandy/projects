import { DocumentEntity } from '../../documents/entities/documents.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { VehicleType } from '../classes/vehicleType.enum';
import { VehicleTrailerType } from '../classes/vehicleTrailerType.enum';
import { VehicleAccessory } from '../classes/vehicleAccessory.enum';
import { VehicleTransmissionType } from '../classes/vehicleTransmissionType.enum';

export class UpsertVehicleDto {
  @ApiProperty()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @ApiProperty()
  @IsOptional()
  type_other?: string;

  @ApiProperty()
  @IsEnum(VehicleTrailerType)
  @IsOptional()
  trailer_type?: VehicleTrailerType;

  @ApiProperty()
  @IsOptional()
  trailer_type_other?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(VehicleTransmissionType)
  transmission_type?: VehicleTransmissionType;

  @ApiProperty()
  @IsOptional()
  make?: string;

  @ApiProperty()
  @IsOptional()
  model?: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  year?: number;

  // todo: figure out how to save this info
  // @ApiProperty()
  // @IsOptional()
  // photo?: DocumentEntity;

  @ApiProperty()
  @IsOptional()
  accessories?: VehicleAccessory[];

  @ApiProperty()
  @IsOptional()
  accessory_other?: string;
}
