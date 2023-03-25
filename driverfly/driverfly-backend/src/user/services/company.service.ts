import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { MailerService } from '@nestjs-modules/mailer';

import { UserDeviceTokenEntity } from '../entities/user-device-token.entity';

import { UserRepository } from '../repositories/user.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { CompanyEntity } from '../entities/company.entity';

const moment = require('moment');

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(UserDeviceTokenEntity)
    private readonly userDeviceTokenEntityRepository: Repository<UserDeviceTokenEntity>,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,

    private readonly mailerService: MailerService,
  ) {}

  async updateCompany(data, id, req) {
    const userId = req.user.userId;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    console.log(user);

    if (!user.company) {
      const errors = { company: 'Company not found!' };
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }

    const companyEntity = new CompanyEntity();
    const updated = Object.assign(companyEntity, data);

    const companyUpdate = await this.companyRepository.update(
      user.company.id,
      updated,
    );

    return await this.companyRepository.findOne(user.company.id);
  }

  async find(id, req) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.userId },
      relations: ['company'],
    });

    console.log(user);
    if (!user.company && user.company.id != id) {
      const errors = { company: 'Company not found!' };
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }

    return await this.companyRepository.findOne(user.company.id);
  }
}
