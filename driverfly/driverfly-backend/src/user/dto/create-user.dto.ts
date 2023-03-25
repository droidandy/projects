import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
