import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Double,
  OneToOne,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IsPhoneNumber } from 'class-validator';

import { UserEntity } from '../../user/entities/user.entity';
import { DriverEmploymentEntity } from './driverEmployment.entity';
import { DriverEquipmentEntity } from './driverEquipment.entity';
import { DriverSafetyQuestionEntity } from './driverSafetyQuestion.entity';
import { DriverLicenseType } from '../classes/driver-license-type.enum';
import { DriverDegree } from '../classes/driver-degree.enum';

@Entity('driver')
export class DriverEntity {
  constructor(id: number = null) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @VersionColumn()
  version?: number;

  @OneToOne((_) => UserEntity, { nullable: false })
  @JoinColumn()
  user?: UserEntity;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  forwardGeocodeId?: number;

  @Column({ nullable: true })
  countyId?: number;

  @Column({ nullable: true })
  neighborhoodId?: number;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  latitude?: number;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  longitude?: number;

  // driver license
  @Column({ nullable: true })
  license_number?: string;

  @Column({ nullable: true })
  license_expiry?: Date;

  @Column({ nullable: true })
  license_state?: string;

  @Column({ type: 'enum', enum: DriverLicenseType, nullable: true })
  license_type?: DriverLicenseType;

  @Column({ nullable: true })
  years_cdl_experience?: number;

  @OneToMany((_) => DriverEquipmentEntity, (t) => t.driver)
  equipment_experience: DriverEquipmentEntity[];

  // education
  @Column({ type: 'enum', enum: DriverDegree, nullable: true })
  highest_degree?: DriverDegree;

  // emergency contact
  @Column({ nullable: true })
  emergency_contact_name?: string;

  @Column({ nullable: true })
  @IsPhoneNumber()
  emergency_contact_number?: string;

  @Column({ nullable: true })
  emergency_contact_relationship?: string;

  // past employment
  @OneToMany((_) => DriverEmploymentEntity, (t) => t.driver)
  employers: DriverEmploymentEntity[];

  // safety background
  @Column({ nullable: true })
  can_pass_drug_test?: boolean;

  @Column({ nullable: true })
  has_past_dui?: boolean;

  @Column({ type: 'simple-array', nullable: true })
  dui_years?: string[];

  @Column({ nullable: true })
  criminal_history?: string;

  @Column({ nullable: true })
  accident_count?: number;

  @Column({ nullable: true })
  accident_details?: string;

  @OneToMany((_) => DriverSafetyQuestionEntity, (t) => t.driver)
  safety_questions: DriverSafetyQuestionEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
