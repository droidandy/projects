import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  public token: string;
}
