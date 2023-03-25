import { EntityRepository, Repository } from 'typeorm';
import { DriverEntity } from '../entities/driver.entity';

@EntityRepository(DriverEntity)
export class DriverRepository extends Repository<DriverEntity> {}
