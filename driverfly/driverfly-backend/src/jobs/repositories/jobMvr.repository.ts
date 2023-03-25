import { EntityRepository, Repository } from 'typeorm';
import { JobMvrEntity } from '../entities';

@EntityRepository(JobMvrEntity)
export class JobMvrRepository extends Repository<JobMvrEntity> {}
