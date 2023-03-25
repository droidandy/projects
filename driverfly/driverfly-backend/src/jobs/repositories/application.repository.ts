import { EntityRepository, Repository } from 'typeorm';
import { ApplicationEntity } from '../entities/applications.entity';

@EntityRepository(ApplicationEntity)
export class ApplicationRepository extends Repository<ApplicationEntity> {}
