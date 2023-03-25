import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job_mvr')
export class JobMvrEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((t) => JobEntity, (e) => e.mvr_requirements)
  @JoinColumn()
  job: JobEntity;

  @Column()
  type?: string;

  @Column({ default: 0 })
  max_count?: number;

  @Column({ default: 0 })
  max_years?: number;
}
