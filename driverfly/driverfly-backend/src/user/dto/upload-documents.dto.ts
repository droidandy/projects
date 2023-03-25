import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentsDto {
  @ApiProperty({
    description: 'Resume of the driver',
    type: 'string',
    format: 'binary',
  })
  // @IsNotEmpty()
  resume?: any;

  @ApiProperty({
    description: 'commercial driving license of the driver',
    type: 'string',
    format: 'binary',
  })
  // @IsNotEmpty()
  commercial_driving_license?: any;

  @ApiProperty({
    description: 'Medical card of the driver',
    type: 'string',
    format: 'binary',
  })
  medical_card?: any;

  @ApiProperty({
    description: 'Motor Vehicle record of  the driver',
    type: 'string',
    format: 'binary',
  })
  mvr_record?: any;
}
