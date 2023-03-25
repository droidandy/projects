import { EntityRepository, Repository } from 'typeorm';
import { JobSkillEntity } from '../entities';

@EntityRepository(JobSkillEntity)
export class JobSkillRepository extends Repository<JobSkillEntity> {}
