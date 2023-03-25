import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { Binary } from 'typeorm';

export class CreateApplicationDto {
  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  qualifications: string;

  @ApiProperty({
    description: 'Resume of the driver',
    type: 'string',
    format: 'binary',
  })
  // @IsNotEmpty()
  resume: any;

  @ApiProperty({
    description: 'commercial driving license of the driver',
    type: 'string',
    format: 'binary',
  })
  // @IsNotEmpty()
  commercial_driving_license: any;

  @ApiProperty({
    description: 'Medical card of the driver',
    type: 'string',
    format: 'binary',
  })
  medical_card: any;

  @ApiProperty()
  @IsNotEmpty()
  cdl_experience: string;

  @ApiProperty()
  @IsNotEmpty()
  voilations: number;

  @ApiProperty()
  @IsNotEmpty()
  drug_test: number;

  @ApiProperty()
  @IsNotEmpty()
  driverfly_account: number;

  // @ApiProperty()
  // @IsNotEmpty()
  // terms: number;

  user: UserEntity;
  jobId: number;
}
