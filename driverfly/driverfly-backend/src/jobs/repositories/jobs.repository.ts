import { EntityRepository, Repository } from 'typeorm';
import { JobEntity } from '../entities';

@EntityRepository(JobEntity)
export class JobsRepository extends Repository<JobEntity> {}
