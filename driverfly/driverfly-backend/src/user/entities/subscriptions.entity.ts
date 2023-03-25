import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum OSType {
  ANDROID = 'android',
  IOS = 'ios',
}

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_id: string;

  @Column({ type: 'text' })
  transaction_receipt: string;

  @Column()
  date: Date;

  // WIP, next sprint
  @Column({
    type: 'enum',
    enum: OSType,
  })
  os_type: OSType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
