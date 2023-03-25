import { UserEntity } from '../../user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('applications')
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => JobEntity, (job) => job.applications)
  job: JobEntity;

  @Column({
    nullable: true,
  })
  location: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    type: 'text',
  })
  qualifications: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  commercial_driving_license: string;

  @Column({ nullable: true })
  medical_card: string;

  @Column({ nullable: true })
  cdl_experience: string;

  @Column({ nullable: true })
  voilations: number;

  @Column({ nullable: true })
  drug_test: number;

  @Column({ nullable: true })
  driverfly_account: number;

  // @Column({ nullable: true })
  // terms: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
