import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpsertJobCriminalDto {
  @ApiProperty()
  type?: string;

  @ApiProperty()
  @IsPositive()
  max_years?: number;
}
