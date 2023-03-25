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
  UseInterceptors,
  UploadedFiles,
  Req,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { UserRO } from '../entities/user.interface';
import { CreateUserDto, UpdateUserDto, CreatePushNotifTokenDto } from '../dto';
import { User } from '../classes/user.decorator';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PasswordResetDto } from '../dto/password-reset-user';
import { RolesGuard } from '../classes/roles.guard';
import { ForgotPasswordDto } from '../dto/password-forgot-user';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadDocumentsDto } from '../dto/upload-documents.dto';
import { DeleteDocumentDto } from '../dto/delete-documents.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller()
@UseGuards(RolesGuard)
// @UseInterceptors(SentryInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('dashboard')
  // // @Roles(UserRole.ADMIN)
  // async DashboardData(@Param() params): Promise<any> {
  //   return await this.userService.DashboardData();
  // }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findUser(@Param() params, @User('id') logged): Promise<UserRO> {
    return await this.userService.findById(logged, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The user has been updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('user/:id')
  async update(
    @Param() params,
    @User('id') loggedIn,
    @Body() userData: UpdateUserDto,
  ): Promise<UserRO> {
    return await this.userService.update(params.id, userData, loggedIn);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been created successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() userData: CreateUserDto): Promise<UserRO> {
    return this.userService.create(userData);
  }

  @ApiResponse({
    status: 200,
    description:
      'The user push token device info has been created successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('users/token')
  async createPushNotifToken(
    @User('email') email: string,
    @Body('token') pushTokenData: CreatePushNotifTokenDto,
    @Res() res: Response,
  ) {
    return this.userService.savePushNotifToken(email, pushTokenData, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description:
      'The user push token device info has been created successfully',
  })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Get('email/verify/:token')
  public async verifyEmail(
    @Param() params,
    @Res() res: Response,
  ): Promise<any> {
    await this.userService.verifyEmail(params.token);
    return res.redirect(303, `https://duepet.com/success.html`);
  }

  @ApiResponse({
    status: 200,
    description: 'The user email has been sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Email is not valid or not found.' })
  @Get('email/resend-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<HttpStatus> {
    await this.userService.createEmailToken(params.email);
    return await this.userService.sendEmailVerification(params.email);
  }

  @ApiResponse({ status: 200, description: 'User email has been successfully' })
  @ApiResponse({
    status: 400,
    description: 'Email is not a valid or not found',
  })
  @Post('forgot-password')
  @UsePipes(new ValidationPipe())
  public async sendEmailForgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<any> {
    return await this.userService.sendEmailForgotPassword(body.email);
  }

  @ApiResponse({
    status: 200,
    description: 'The user password has been changed successfully',
  })
  @ApiResponse({ status: 403, description: 'Email is not valid or not found' })
  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  public async setNewPassword(
    @Body() resetPassword: PasswordResetDto,
  ): Promise<any> {
    console.log(resetPassword);

    return await this.userService.resetPassword(resetPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The user password has been changed successfully',
  })
  @ApiResponse({ status: 403, description: 'Email is not valid or not found' })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @User() user,
    @Body('change-password') changePassword,
  ): Promise<any> {
    return await this.userService.changePassword(user, changePassword);
  }

  @ApiResponse({
    status: 200,
    description: 'The user password has been changed successfully',
  })
  @ApiResponse({ status: 403, description: 'Email is not valid or not found' })
  @Get('resend-verification-email')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  public async resendEmailVerification(): Promise<any> {
    return await this.userService.reSendEmailToNonActivatedUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Removed user token' })
  @Post('remove-token')
  @HttpCode(HttpStatus.OK)
  public async removeToken(@User() user, @Body('token') token): Promise<any> {
    return await this.userService.removeToken(user, token);
  }

  @Get('user/uploaded/documents')
  @UseGuards(JwtAuthGuard)
  async documents(@Req() req) {
    console.log(req.user);
    return this.userService.getUploadedDocument(req.user.id);
  }

  @Post('user/documents')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'resume',
        maxCount: 1,
      },
      {
        name: 'commercial_driving_license',
        maxCount: 1,
      },
      {
        name: 'medical_card',
        maxCount: 1,
      },
      {
        name: 'mvr_record',
        maxCount: 1,
      },
    ]),
  )
  apply(
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File;
      commercial_driving_license?: Express.Multer.File;
      medical_card?: Express.Multer.File;
      mvr_record?: Express.Multer.File;
    },
    @Body()
    uploadDocumentDto: UploadDocumentsDto,
    @Req() req,
  ) {
    return this.userService.uploadDocuments(
      req.user.id,
      files,
      uploadDocumentDto,
      req,
    );
  }

  @Delete('user/documents')
  @UseGuards(JwtAuthGuard)
  deleteFiles(
    @Body()
    deleteDocumentDto: DeleteDocumentDto,
    @Req() req,
  ) {
    return this.userService.deleteUserDocuments(req.user.id, deleteDocumentDto);
  }
}
