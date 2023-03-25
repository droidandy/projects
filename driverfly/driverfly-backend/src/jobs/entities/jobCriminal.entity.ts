import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job_criminal')
export class JobCriminalEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((t) => JobEntity, (e) => e.mvr_requirements)
  @JoinColumn()
  job: JobEntity;

  @Column()
  type?: string;

  @Column({ default: 0 })
  max_years?: number;
}
