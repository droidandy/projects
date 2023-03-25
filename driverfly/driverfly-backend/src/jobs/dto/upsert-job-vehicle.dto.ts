import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UpsertVehicleDto } from '../../company/dto/upsert-vehicle.dto';

export class UpsertJobVehicleDto extends PartialType(UpsertVehicleDto) {
  @ApiProperty()
  @IsOptional()
  id?: number;
}
