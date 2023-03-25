import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, CreatePushNotifTokenDto } from '../dto';

import { UserRO } from '../entities/user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import * as crypto from 'crypto';
import { EmailTokenUserDto } from '../dto/email-token-user';
import { PasswordTokenUserDto } from '../dto/password-token-user';
const jwt = require('jsonwebtoken');
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordResetDto } from '../dto/password-reset-user';
import { UserDeviceTokenEntity } from '../entities/user-device-token.entity';
import { Response } from 'express';

import { UserRepository } from '../repositories/user.repository';
// import DocumentUploadService from '../../jobs/document.service';
import { UploadDocumentsDto } from '../dto/upload-documents.dto';
import { CompanyEntity } from '../entities/company.entity';
import DocumentUploadService from '../../documents/classes/document-upload.service';
import {
  DocumentEntity,
  DocumentType,
} from '../../documents/entities/documents.entity';
import { LoginDto } from '../../auth/dto/login.dto';
import { DeleteDocumentDto } from '../dto/delete-documents.dto';
import { DriverEntity } from '../../driver/entities/driver.entity';
const moment = require('moment');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDeviceTokenEntity)
    private readonly userDeviceTokenEntityRepository: Repository<UserDeviceTokenEntity>,

    @InjectRepository(DocumentEntity)
    private readonly documentEntity: Repository<DocumentEntity>,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly documentService: DocumentUploadService,
  ) {}

  // this should be admin protected
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async adminCountAll(): Promise<number> {
    return await this.userRepository.count();
  }
  // this should be admin protected
  async adminFindUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(loggedIn, loginUserDto: LoginDto): Promise<UserEntity> {
    const onlyUser = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: loginUserDto.email })
      .leftJoinAndSelect('user.pets', 'pets')
      .getOne();
    if (loggedIn != onlyUser.id) {
      throw new ForbiddenException('You are not allowed here.');
    }

    if (!onlyUser) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto
        .createHmac('sha256', loginUserDto.password)
        .digest('hex'),
    };

    const user = await this.userRepository.findOne(findOneOptions);

    if (!user) {
      const errors = { user: 'Password not correct!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (!user.activated) {
      const errors = { user: 'User not activated.' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const { email, password, first_name, last_name, role } = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const user = await qb.getOne();

    console.log({ user });

    if (user) {
      const errors = { user: 'Email must be unique.' };
      throw new HttpException({ errors }, HttpStatus.BAD_REQUEST);
    }

    // create new user
    const newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    if (role == UserRole.COMPANY) {
      newUser.roles = UserRole.COMPANY;
    } else if (role == UserRole.DRIVER) {
      newUser.roles = UserRole.DRIVER;
    } else {
      newUser.roles = UserRole.USER;
    }
    newUser.activated = true;
    first_name.trim();
    newUser.first_name = first_name;
    last_name.trim();
    newUser.last_name = last_name;
    newUser.name = `${first_name} ${last_name}`;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const errors = { username: 'User input is not valid.' };
      throw new HttpException({ errors }, HttpStatus.BAD_REQUEST);
    } else {
      const savedUser = await this.userRepository.save(newUser);

      if (role == UserRole.COMPANY) {
        const company = new CompanyEntity();
        savedUser.company = company;
        const companyUser = await getManager().save(company);

        await this.userRepository.update(savedUser.id, newUser);
      }

      if (role == UserRole.DRIVER) {
        const driver = new DriverEntity();
        driver.user = savedUser;
        const driverSave = await getManager().save(driver);
      }

      const emailTokenCreated = await this.createEmailToken(savedUser.email);

      const emailSent = await this.sendEmailVerification(savedUser.email);
      //send notification to client 'NEW USER REGISTRATION'
      await this.sendRegistrationEmailNotification(savedUser);

      return await this.buildUserRO(savedUser);
    }
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    loggedIn: string,
  ): Promise<UserRO> {
    const toUpdate = await this.userRepository.findOne({ id: id });

    if (!toUpdate) {
      const errors = { User: 'User not found' };
      throw new HttpException({ errors }, 401);
    }
    if (Number(loggedIn) !== toUpdate.id) {
      throw new ForbiddenException('You are not allowed here.');
    }
    if (dto.email) {
      const emailExist = await this.userRepository.findOne({
        email: dto.email,
      });
      if (emailExist && emailExist.id != id) {
        const errors = {
          User: 'This email is already used with another account.',
        };
        throw new HttpException({ errors }, 401);
      }
    }

    delete toUpdate.password;

    if (dto.password && dto.old_password) {
      // check for old password, lets login

      const loginDto = new LoginDto();
      loginDto.email = toUpdate.email;
      loginDto.password = dto.old_password;

      const userLoggedIn = await this.findOne(loggedIn, loginDto);

      if (userLoggedIn) {
        await this.setPassword(toUpdate.email, dto.password);
        delete dto.password;
      } else {
        const errors = { User: 'Your old password is incorrect' };
        throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    // if user is already a premium, he can extend his exp date

    if (!toUpdate.premium_account) {
      if (dto.auto_renew) delete dto.auto_renew;
      if (dto.exp_date) delete dto.exp_date;
    }

    const updated = Object.assign(toUpdate, dto);
    const savedUser = await this.userRepository.save(updated);

    if (!!!savedUser) {
      const errors = { User: 'User could not be Updated! An error occured' };
      throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return await this.buildUserRO(savedUser);
  }

  async findById(logged, id: number): Promise<UserRO> {
    if (logged !== id) {
      throw new ForbiddenException('You are not allowed here.');
    }
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.pets', 'pets')
      .where('user.id = :id', { id: id })
      .getOne();

    if (!user) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, 401);
    }

    return await this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.name',
        'user.roles',
        'user.swipe_actions',
        'user.theme_color',
        'user.timezone',
        'user.language',
        'user.activated',
        'user.premium_account',
        'user.exp_date',
        'user.auto_renew',
        'user.enabled_notifications',
        'user.reminderCount',
      ])
      .where('user.email = :email', { email: email })
      .getOne();

    if (!user) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    // async function asyncForEach(array, callback) {
    //   for (let index = 0; index < array.length; index++) {
    //     await callback(array[index], index, array);
    //   }
    // }
    // //we can send only to users which have reminders and have push tokens
    // await asyncForEach(user.pets, async (pet) => {
    //   await this.folderService.addSystemFolderToPet(pet);
    // });

    //user.reminderCount = await this.calcActiveReminderCountFromPets(user.pets); // this is just shit
    return await this.buildUserRO(user);
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      email: user.email,
      exp: exp.getTime() / 1000,
    });
  }

  private async buildUserRO(user: UserEntity): Promise<UserRO> {
    const userRO = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      activated: user.activated,
      first_name: user.first_name,
      last_name: user.last_name,
      contact_number: user.contact_number,
      cell_number: user.cell_number,
      state: user.state,
      country: user.country,
      city: user.city,
      zipcode: user.zipcode,
      cdl_experience: user.cdl_experience,
      voilations: user.voilations,
      drug_test: user.drug_test,
      qualification: user.qualification,
    };

    return { user: userRO };
  }

  // can be used for creating email/pass reset token
  private createResetToken(): number {
    return Math.floor(Math.random() * 9000000) + 1000000; //Generate 7 digits number
  }

  async setPassword(email: string, newPassword: string): Promise<HttpStatus> {
    const userFromDb = await this.userRepository.findOne({ email: email });
    if (!userFromDb) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, 401);
    }

    const dto = new PasswordResetDto();
    dto.password = crypto.createHmac('sha256', newPassword).digest('hex');

    const updated = Object.assign(userFromDb, dto);
    const savedUser = await this.userRepository.save(updated);

    if (!!!savedUser) {
      const errors = { User: 'Password could not be set, An error occured!' };
      throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return HttpStatus.OK;
  }

  async createEmailToken(email: string): Promise<HttpStatus> {
    const emailVerification = await this.userRepository.findOne({
      email: email,
    });

    if (!emailVerification) {
      const errors = { User: 'No user found with that email' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete emailVerification.password;

    const dto = new EmailTokenUserDto();
    dto.activated = true;
    dto.emailToken = this.createResetToken();
    dto.emailTokenTimestamp = new Date();

    const updated = Object.assign(emailVerification, dto);

    const emailVerificationUpdated = await this.userRepository.save(updated);

    if (!!!emailVerificationUpdated) {
      const errors = {
        User: 'Email Verification could not be completed! An error occured',
      };
      throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return HttpStatus.OK;
  }

  async sendEmailVerification(email: string): Promise<HttpStatus> {
    const user = await this.userRepository.findOne({ email: email });

    if (user && user.emailToken) {
      const activationUrl = 'api/email/verify/' + user.emailToken;

      console.log({ activationUrl });
      return this.mailerService
        .sendMail({
          to: user.email, //TODO change to user
          subject: 'Verify your email',
          template: 'email-activation',
          context: {
            url: activationUrl,
          },
        })
        .then(() => {
          return HttpStatus.OK;
        })
        .catch((err) => {
          console.log(err);
          throw new HttpException({ err }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
    } else {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async sendRegistrationEmailNotification(
    newUser: UserEntity,
  ): Promise<HttpStatus> {
    return this.mailerService
      .sendMail({
        to: 'adnan@codeupscale.com',
        subject: `${newUser.name} has just registered on Driverfly`,
        template: 'registration-notification',
        context: {
          userName: newUser.name,
          userEmail: newUser.email,
        },
      })
      .then(() => {
        return HttpStatus.OK;
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException({ err }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async verifyEmail(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      emailToken: parseInt(token),
    });
    if (user && user.email) {
      user.activated = true;

      const savedUser = await this.userRepository.save(user);

      if (!!!savedUser) {
        const errors = { User: 'User could not be updated! An error occurred' };
        throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return savedUser;
    } else {
      const errors = { User: 'User or code not found' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async createForgottenPasswordToken(email: string): Promise<UserEntity> {
    const forgottenPassword = await this.userRepository.findOne({
      email: email,
    });
    if (
      forgottenPassword.passwordTokenTimestamp &&
      (new Date().getTime() -
        forgottenPassword.passwordTokenTimestamp.getTime()) /
        60000 <
        15
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      delete forgottenPassword.password;

      const dto = new PasswordTokenUserDto();
      dto.password_token = this.createResetToken();
      dto.passwordTokenTimestamp = new Date();

      const updated = Object.assign(forgottenPassword, dto);

      const forgottenPasswordUpdated = await this.userRepository.save(updated);

      if (!!!forgottenPasswordUpdated) {
        const errors = { User: 'An error occured' };
        throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return forgottenPassword;
    }

    return forgottenPassword;
    // }
  }

  async getForgottenPasswordModel(
    newPasswordToken: string,
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({
      password_token: parseInt(newPasswordToken),
    });
  }

  async resetPassword(passwordResetDto: PasswordResetDto): Promise<any> {
    const user = await this.getForgottenPasswordModel(
      passwordResetDto.passwordResetToken,
    );

    if (!user) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (passwordResetDto.password != passwordResetDto.passwordConfirm) {
      const errors = {
        User: 'Password and Confirmation Password are do not match!',
      };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (passwordResetDto.password) {
      await this.setPassword(user.email, passwordResetDto.password);
      delete passwordResetDto.password;
    }

    const updated = Object.assign(user, passwordResetDto);
    const savedUser = await this.userRepository.save(updated);

    if (!!!savedUser) {
      const errors = { User: 'User could not be updated! An error occured' };
      throw new HttpException({ errors }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return HttpStatus.OK;
  }

  async changePassword(oldUser, changePassword): Promise<any> {
    const loginUserDto = new LoginDto();
    loginUserDto.email = oldUser.email;
    loginUserDto.password = changePassword.oldPassword;
    const user = await this.findOne(oldUser.userId, loginUserDto);

    if (!user) {
      const errors = { User: 'Your Old Password does not match!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (changePassword.password != changePassword.passwordConfirm) {
      const errors = {
        User: 'Password and Confirmation Password are do not match!',
      };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (changePassword.password) {
      await this.setPassword(user.email, changePassword.password);
      delete changePassword.password;
    }

    return HttpStatus.OK;
  }

  async sendEmailForgotPassword(email: string): Promise<HttpStatus> {
    const userFromDb = await this.userRepository.findOne({ email: email });

    if (!userFromDb) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const tokenModel = await this.createForgottenPasswordToken(email);

    let url =
      'http://localhost:3000/reset-password?passwordResetToken=' +
      tokenModel.password_token;
    // 'http://localhost:3000/reset-password' + tokenModel.password_token;
    if (userFromDb.roles === 'admin') {
      url =
        'http://admin-20200101.Driverfly.com/new-password/' +
        tokenModel.password_token;
    }

    if (tokenModel && tokenModel.password_token) {
      return this.mailerService
        .sendMail({
          to: email,
          subject: 'New Password',
          template: 'password-reset',
          context: {
            url: url,
          },
        })
        .then(() => {
          return HttpStatus.OK;
        })
        .catch((err) => {
          console.log(err);
          const errors = { user: 'An error occured' };
          throw new HttpException({ err }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
    } else {
      const errors = { User: 'User or token not found' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async cancelUserSubscription(email: string, subscriptionData) {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      const errors = { User: 'User not found!' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    user.auto_renew = subscriptionData.auto_renew;
    return await this.userRepository.save(user);
  }

  async savePushNotifToken(
    email: string,
    tokenData: CreatePushNotifTokenDto,
    res: Response,
  ) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['device_tokens'],
    });

    if (!user) {
      const errors = { User: 'User not found' };
      throw new HttpException({ errors }, 401);
    }

    //check if its present
    let isPresent = false;
    if (user.device_tokens.length) {
      user.device_tokens.map((token) => {
        if (token.push_token == tokenData.push_token) isPresent = true;
      });
    }

    if (isPresent) {
      const errors = { User: 'User Token already present' };
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    } // 200 ok status

    const deviceToken = new UserDeviceTokenEntity();
    deviceToken.push_token = tokenData.push_token;
    deviceToken.device_id = tokenData.device_id;

    if (Array.isArray(user.device_tokens)) {
      user.device_tokens.push(deviceToken);
    } else {
      user.device_tokens = [deviceToken];
    }

    return await this.userRepository.save(user);
  }

  async reSendEmailToNonActivatedUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('activated = 0')
      .andWhere('DATE(created) > "2020-11-05"')
      .getMany();

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const start = async () => {
      await asyncForEach(users, async (user) => {
        await this.createEmailToken(user.email);
        await this.sendEmailVerification(user.email);
      });
    };
    await start();
  }

  async removeToken(user, token) {
    return await this.userDeviceTokenEntityRepository
      .createQueryBuilder('device_token')
      .leftJoinAndSelect('device_token.user', 'user')
      .where('device_token.push_token = :token', { token: token })
      .delete()
      .execute();
  }

  async uploadDocuments(
    id: number,
    files,
    uploadDocumentsDto: UploadDocumentsDto,
    req,
  ) {
    const user = await this.userRepository.findOne(id);
    if (files.resume) {
      await this.documentEntity.delete({
        user: user,
        type: DocumentType.RESUME,
      });

      const uploadResumePath = await this.documentService.uploadS3(
        'resume',
        files.resume[0],
      );

      const resume = new DocumentEntity();
      resume.path = uploadResumePath;
      resume.user = user;
      resume.type = DocumentType.RESUME;
      resume.name = files.resume[0].originalname;
      await this.documentEntity.save(resume);
    }

    if (files.commercial_driving_license) {
      await this.documentEntity.delete({
        user: user,
        type: DocumentType.DRIVER_LICENSE,
      });
      const commercial_driving_license = new DocumentEntity();
      commercial_driving_license.path = await this.documentService.uploadS3(
        DocumentType.DRIVER_LICENSE,
        files.commercial_driving_license[0],
      );
      commercial_driving_license.user = user;
      commercial_driving_license.type = DocumentType.DRIVER_LICENSE;
      commercial_driving_license.name =
        files.commercial_driving_license[0].originalname;
      await this.documentEntity.save(commercial_driving_license);
    }

    if (files.medical_card) {
      await this.documentEntity.delete({
        user: user,
        type: DocumentType.MEDICAL_CARD,
      });
      const medical_card = new DocumentEntity();
      medical_card.path = await this.documentService.uploadS3(
        DocumentType.MEDICAL_CARD,
        files.medical_card[0],
      );
      medical_card.user = user;
      medical_card.type = DocumentType.MEDICAL_CARD;
      medical_card.name = files.medical_card[0].originalname;
      await this.documentEntity.save(medical_card);
    }

    if (files.mvr_record) {
      await this.documentEntity.delete({
        user: user,
        type: DocumentType.MVR,
      });
      const mvr_record = new DocumentEntity();
      mvr_record.path = await this.documentService.uploadS3(
        DocumentType.MVR,
        files.mvr_record[0],
      );
      mvr_record.user = user;
      mvr_record.type = DocumentType.MVR;
      mvr_record.name = files.mvr_record[0].originalname;
      await this.documentEntity.save(mvr_record);
    }

    return await this.documentService.getFiles(user, null);
  }

  async getUploadedDocument(userId) {
    const user = await this.userRepository.findOne(userId);

    return await this.documentService.getFiles(user, null);
  }

  async deleteUserDocuments(userId, document: DeleteDocumentDto) {
    const user = await this.userRepository.findOne(userId);

    return await this.documentService.deleteFile(user, document.type);
  }
}
