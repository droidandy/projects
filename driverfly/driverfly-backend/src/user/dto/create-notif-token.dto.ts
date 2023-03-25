import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePushNotifTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly push_token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly device_id: string;
}
