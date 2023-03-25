import { IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly theme_color: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly language: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public old_password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public cdl_experience: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public voilations: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public drug_test: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly swipe_actions: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly timezone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly enabled_notifications: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly premium_account: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public auto_renew: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public exp_date: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public first_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public last_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public contact_number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public cell_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public zipcode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public qualification: string;
}
