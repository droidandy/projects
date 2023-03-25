import { EntityRepository, Repository } from 'typeorm';
import { DriverPreferenceEntity } from '../entities/driverPreference.entity';

@EntityRepository(DriverPreferenceEntity)
export class DriverPreferenceRepository extends Repository<DriverPreferenceEntity> {}
