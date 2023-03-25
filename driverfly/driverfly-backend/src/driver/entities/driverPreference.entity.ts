import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { DriverEntity } from './driver.entity';

export enum DriverPreferenceCategory {
  COMMUNICATION = 'COMMUNICATION',
  SHARING = 'SHARING',
  MATCHING = 'MATCHING',
}

@Entity('driver_preference')
@Unique('UQ_DriverPreference', ['driver', 'category', 'label'])
export class DriverPreferenceEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((_) => DriverEntity, { nullable: false })
  @JoinColumn()
  driver?: DriverEntity;

  @Column({ nullable: false })
  category?: string;

  @Column({ nullable: false })
  label?: string;

  @Column({ nullable: true })
  value?: string;
}
