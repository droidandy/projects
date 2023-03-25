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

@Entity('driver_equipment')
@Unique('UQ_Equipment', ['driver', 'type'])
export class DriverEquipmentEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_) => DriverEntity, (t) => t.equipment_experience, {
    nullable: false,
  })
  @JoinColumn()
  driver: DriverEntity;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  years?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
