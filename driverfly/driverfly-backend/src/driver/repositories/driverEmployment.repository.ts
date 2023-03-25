import { EntityRepository, Repository } from 'typeorm';
import { DriverEmploymentEntity } from '../entities/driverEmployment.entity';

@EntityRepository(DriverEmploymentEntity)
export class DriverEmploymentRepository extends Repository<DriverEmploymentEntity> {}
