import { EntityRepository, Repository } from 'typeorm';
import { DriverSafetyQuestionEntity } from '../entities/driverSafetyQuestion.entity';

@EntityRepository(DriverSafetyQuestionEntity)
export class DriverSafetyQuestionRepository extends Repository<DriverSafetyQuestionEntity> {}
