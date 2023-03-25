import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './entities/driver.entity';
import { DriverEmploymentEntity } from './entities/driverEmployment.entity';
import { DriverEquipmentEntity } from './entities/driverEquipment.entity';
import { DriverSafetyQuestionEntity } from './entities/driverSafetyQuestion.entity';
import { DriverRepository } from './repositories/driver.repository';
import { DriverEmploymentRepository } from './repositories/driverEmployment.repository';
import { DriverEquipmentRepository } from './repositories/driverEquipment.repository';
import { DriverSafetyQuestionRepository } from './repositories/driverSafetyQuestion.repository';
import { DriverService } from './services/driver.service';
import { DriverController } from './controllers/driver.controller';
import { DriverPreferenceEntity } from './entities/driverPreference.entity';
import { DriverPreferenceRepository } from './repositories/driverPreference.repository';
import { GeoModule } from 'src/geo/geo.module';

@Module({
  imports: [
    forwardRef(() => GeoModule),
    TypeOrmModule.forFeature([
      DriverEntity,
      DriverEmploymentEntity,
      DriverEquipmentEntity,
      DriverPreferenceEntity,
      DriverSafetyQuestionEntity,
      DriverRepository,
      DriverEmploymentRepository,
      DriverEquipmentRepository,
      DriverPreferenceRepository,
      DriverSafetyQuestionRepository,
    ]),
  ],
  providers: [DriverService],
  controllers: [DriverController],
  exports: [DriverService, TypeOrmModule],
})
export class DriverModule {}
