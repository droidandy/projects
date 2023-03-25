import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  BeforeUpdate,
  AfterLoad,
  Double,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import * as crypto from 'crypto';
import { IsEmail } from 'class-validator';

import { UserDeviceTokenEntity } from './user-device-token.entity';
import { CompanyEntity } from './company.entity';
import { JobEntity } from '../../jobs/entities/job.entity';
import { DocumentEntity } from '../../documents/entities/documents.entity';

const moment = require('moment');

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DEV = 'dev',
  DRIVER = 'driver',
  COMPANY = 'company',
}

@Entity('user')
export class UserEntity {
  constructor(id: number = null) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true, default: true })
  enabled_notifications: boolean;

  // WIP, next sprint
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  roles: UserRole;

  @Column({ default: false })
  activated?: boolean;

  // 0 White, 1 is Dark Theme
  @Column({ default: 0 })
  theme_color?: boolean;

  // LR is 0
  @Column({ default: 0 })
  swipe_actions?: boolean;

  @Column({ nullable: false, default: 'Europe/London' })
  timezone: string;

  @Column({ nullable: true, default: null })
  latitude: number;

  @Column({ nullable: true, default: null })
  longitude: number;

  @Column({ nullable: true, default: 'en' })
  language: string;

  @Column({ nullable: true, default: null })
  contact_number: string;

  @Column({ nullable: true })
  cell_number?: string;

  @Column({ nullable: true, default: null })
  state: string;

  @Column({ nullable: true, default: null })
  country: string;

  @Column({ nullable: true, default: null })
  zipcode: string;

  @Column({ nullable: true, default: null })
  city: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ nullable: true })
  commercial_driving_license: string;

  @Column({ nullable: true })
  medical_card: string;

  @Column({ nullable: true })
  cdl_experience: string;

  @Column({ nullable: true })
  voilations: string;

  @Column({ nullable: true })
  drug_test: number;

  @Column({ nullable: true })
  emailToken?: number;

  @Column({ type: 'timestamp', nullable: true })
  emailTokenTimestamp?: Date;

  @Column({ nullable: true })
  password_token?: number;

  @Column({ type: 'timestamp', nullable: true })
  passwordTokenTimestamp?: Date;

  //TBD
  /*@Column()
  sync_statuses: SyncEntity?*/

  // paid or free account, might need payment info in the future
  @Column({ default: false })
  premium_account?: boolean;
  @AfterLoad()
  hasExpired() {
    if (this.exp_date && moment(this.exp_date).isAfter(moment())) {
      this.premium_account = true;
    }
    if (this.exp_date && moment(this.exp_date).isBefore(moment())) {
      this.premium_account = false;
    }
  }

  @Column({ nullable: true })
  exp_date?: Date;

  @Column({ default: false })
  auto_renew?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // petCount = 0;

  @Column({ default: 0 })
  reminderCount: number;

  @Column({ default: '0.0.1' })
  appVersion: string;

  @ManyToMany(
    (type) => UserDeviceTokenEntity,
    (device_token) => device_token.user,
    { cascade: true },
  )
  @JoinTable()
  device_tokens: UserDeviceTokenEntity[];

  @ManyToOne((type) => CompanyEntity, (company) => company.users, {
    eager: true,
  })
  company: CompanyEntity;

  @OneToMany((type) => DocumentEntity, (document) => document.user)
  documents: DocumentEntity[];

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
