import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpsertJobMvrDto {
  @ApiProperty()
  type?: string;

  @ApiProperty()
  max_count?: number;

  @ApiProperty()
  @IsPositive()
  max_years?: number;
}
