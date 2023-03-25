import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';

import { DriverEntity } from './driver.entity';

export enum DriverSafetyQuestionType {
  LICENSE_REVOKED = 'LICENSE_REVOKED',
  VIOLATIONS_PSP = 'VIOLATIONS_PSP',
  TICKETS = 'TICKETS',
  POSITIVE_DRUG_TEST = 'POSITIVE_DRUG_TEST',
}

@Entity('driver_safety_question')
@Unique('UQ_TYPE', ['driver', 'type'])
export class DriverSafetyQuestionEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_) => DriverEntity, (t) => t.safety_questions, {
    nullable: false,
  })
  @JoinColumn()
  driver: DriverEntity;

  @Column({ type: 'enum', enum: DriverSafetyQuestionType })
  type: DriverSafetyQuestionType;

  @Column()
  response: boolean;

  @Column({ nullable: true })
  details?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
