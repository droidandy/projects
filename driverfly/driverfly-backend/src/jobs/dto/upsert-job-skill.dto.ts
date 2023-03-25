import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class UpsertJobSkillDto {
  @ApiProperty()
  type?: string;

  @ApiProperty()
  @IsPositive()
  years?: number;
}
