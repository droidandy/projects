import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpsertDriverEquipmentDto {
  @ApiProperty()
  @IsNotEmpty()
  type?: string;

  @ApiProperty()
  @IsPositive()
  years?: number;
}
