import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { UserRO } from '../entities/user.interface';
import { CreateUserDto, UpdateUserDto, CreatePushNotifTokenDto } from '../dto';
import { User } from '../classes/user.decorator';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordResetDto } from '../dto/password-reset-user';
import { RolesGuard } from '../classes/roles.guard';
import { ForgotPasswordDto } from '../dto/password-forgot-user';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from '../services/company.service';

@ApiBearerAuth()
@ApiTags('company')
@Controller()
@UseGuards(RolesGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiResponse({
    status: 200,
    description:
      'The company has been successfully updated. The response contains the updated company.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Put('/companies/:id')
  update(@Body() data: UpdateCompanyDto, @Param('id') id: string, @Req() req) {
    return this.companyService.updateCompany(data, id, req);
  }

  @ApiResponse({
    status: 200,
    description:
      'The company has been successfully updated. The response contains the updated company.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Get('/companies/:id')
  show(@Param('id') id: string, @Req() req) {
    console.log(id);
    return this.companyService.find(+id, req);
  }
}
