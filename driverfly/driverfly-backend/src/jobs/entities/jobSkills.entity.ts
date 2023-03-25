import { UserEntity } from '../../user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  VersionColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Double,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job_skills')
export class JobSkillEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((t) => JobEntity)
  @JoinColumn()
  job?: JobEntity;

  @Column()
  type: string;

  @Column()
  years: number;
}
