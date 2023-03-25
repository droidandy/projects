import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeUpdate,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('device_token')
export class UserDeviceTokenEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  push_token: string;

  @Column({ type: 'varchar', nullable: false })
  device_id: string;

  @ManyToMany((type) => UserEntity, (user) => user.device_tokens)
  user: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;
  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
