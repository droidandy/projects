import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Double,
  JoinColumn,
} from 'typeorm';
import { IsPhoneNumber } from 'class-validator';
import { DriverEntity } from './driver.entity';

@Entity('driver_employment')
export class DriverEmploymentEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((_) => DriverEntity, (t) => t.employers, { nullable: false })
  @JoinColumn()
  driver: DriverEntity;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'timestamp', nullable: true })
  start_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_at?: Date;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip_code?: string;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  latitude?: Double;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  longitude?: Double;

  @IsPhoneNumber()
  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  can_contact: boolean;

  @Column({ default: false })
  is_subject_to_fmcsrs: boolean;

  @Column({ default: false })
  is_subject_to_drug_tests: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
