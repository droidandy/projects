import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { UpsertLocationDto } from '../../company/dto/upsert-location.dto';

export class UpsertJobLocationDto extends PartialType(UpsertLocationDto) {
  @ApiProperty()
  @IsPositive({ message: 'id is required if street is not supplied' })
  @ValidateIf((v: UpsertJobLocationDto) => !!v.id || !!!v.street)
  id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'street is required if id is not supplied' })
  @ValidateIf((v: UpsertJobLocationDto) => !!!v.id || !!v.street)
  street?: string;
}
