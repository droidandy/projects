import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './controllers/location.controller';
import { VehicleController } from './controllers/vehicle.controller';
import { LocationRepository } from './repositories/location.repository';
import { VehicleRepository } from './repositories/vehicle.repository';

import { LocationEntity, VehicleEntity } from './entities';
import { LocationService, VehicleService } from './services';
import { GeoModule } from 'src/geo/geo.module';

@Module({
  imports: [
    forwardRef(() => GeoModule),
    TypeOrmModule.forFeature([
      VehicleEntity,
      VehicleRepository,
      LocationEntity,
      LocationRepository,
    ]),
  ],
  controllers: [VehicleController, LocationController],
  providers: [VehicleService, LocationService],
  exports: [VehicleService, LocationService],
})
export class CompanyModule {}
