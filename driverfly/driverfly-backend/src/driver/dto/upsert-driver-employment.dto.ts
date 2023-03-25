import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpsertDriverEmploymentDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  start_at?: Date;

  @ApiProperty()
  @IsOptional()
  end_at?: Date;

  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

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

  @IsPhoneNumber()
  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  can_contact: boolean;

  @ApiProperty()
  @IsOptional()
  is_subject_to_fmcsrs: boolean;

  @ApiProperty()
  @IsOptional()
  is_subject_to_drug_tests: boolean;
}
