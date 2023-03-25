import { EntityRepository, Repository } from 'typeorm';
import { JobCriminalEntity } from '../entities';

@EntityRepository(JobCriminalEntity)
export class JobCriminalRepository extends Repository<JobCriminalEntity> {}
