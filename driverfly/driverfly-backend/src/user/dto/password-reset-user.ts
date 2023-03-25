import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// we will see the design and change this

export class PasswordResetDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly passwordResetToken: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  public passwordConfirm: string;
}
