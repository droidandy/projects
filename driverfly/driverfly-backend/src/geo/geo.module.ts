import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoCityController } from './controllers/geo-city.controller';
import { GeoCountyController } from './controllers/geo-county.controller';
import { GeoStateController } from './controllers/geo-state.controller';
import { CityEntity, CountyEntity, ForwardGeocodeEntity, NeighborhoodEntity, StateEntity } from './entities';
import { CityRepository, CountyRepository, ForwardGeocodeRepository, NeighborhoodRepository, StateRepository } from './repositories';
import { GeoService } from './services/geo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StateEntity,
      CountyEntity,
      CityEntity,
      NeighborhoodEntity,

      ForwardGeocodeEntity,

      StateRepository,
      CountyRepository,
      CityRepository,
      NeighborhoodRepository,

      ForwardGeocodeRepository,
    ]),
  ],
  controllers: [GeoStateController, GeoCountyController, GeoCityController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
