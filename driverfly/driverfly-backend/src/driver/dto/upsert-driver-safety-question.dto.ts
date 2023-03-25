import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DriverSafetyQuestionType } from '../entities/driverSafetyQuestion.entity';

export class UpsertDriverSafetyQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  type?: DriverSafetyQuestionType;

  @ApiProperty()
  response: boolean;

  @ApiProperty()
  @IsOptional()
  details?: string;
}
