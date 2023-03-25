import { EntityRepository, Repository } from 'typeorm';
import { DriverEquipmentEntity } from '../entities/driverEquipment.entity';

@EntityRepository(DriverEquipmentEntity)
export class DriverEquipmentRepository extends Repository<DriverEquipmentEntity> {}
