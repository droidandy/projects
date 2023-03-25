import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../user/entities/company.entity';
import { safeAssign } from '../../shared/utils';
import { UserEntity } from '../../user/entities/user.entity';
import { LocationRepository } from '../repositories/location.repository';
import { LocationEntity } from '../entities/location.entity';
import { UpsertLocationDto } from '../dto/upsert-location.dto';
import { GeoService } from 'src/geo/services/geo.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository, //private readonly documentUploadService: DocumentUploadService,

    private readonly geoService: GeoService,
  ) {}

  private assignLocationSafe(entity: LocationEntity, dto: UpsertLocationDto) {
    safeAssign(dto, entity, ['street', 'city', 'state', 'zip_code']);
  }

  private pruneLocation(entity: LocationEntity) {
    if (entity) {
      delete entity.company;
    }
  }

  async create(user: UserEntity, companyId: number, dto: UpsertLocationDto) {
    let entity: LocationEntity =
      await this.locationRepository.findByCompanyIdAndStreet(
        companyId,
        dto.street,
      );

    if (entity) {
      throw new HttpException(
        { errors: 'Duplicate location detected' },
        HttpStatus.CONFLICT,
      );
    } else {
      entity = new LocationEntity();
      entity.company = new CompanyEntity(companyId);
    }

    return await this.upsert(dto, entity);
  }
  async update(
    user: UserEntity,
    companyId: number,
    id: number,
    dto: UpsertLocationDto,
  ) {
    let entity: LocationEntity =
      await this.locationRepository.findByCompanyIdAndId(companyId, id);

    if (!entity) {
      throw new HttpException(
        { errors: 'Location Id not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.upsert(dto, entity);
  }

  private async upsert(dto: UpsertLocationDto, location: LocationEntity) {
    this.assignLocationSafe(location, dto);

    // perform forward geocoding
    await this.geoService.forwardGeocodeAndSet(location);

    location = await this.locationRepository.save(location);

    // remove system fields
    this.pruneLocation(location);

    return location;
  }

  async delete(user: UserEntity, companyId: number, id: number) {
    const location = await this.locationRepository.findByCompanyIdAndId(
      companyId,
      id,
    );

    if (!location)
      throw new HttpException(
        { errors: 'Location Id not found' },
        HttpStatus.NOT_FOUND,
      );

    await this.locationRepository.delete(location);
  }

  async findAll(user: UserEntity, companyId: number) {
    const vehicles = await this.locationRepository.findByCompanyId(companyId);

    vehicles.forEach(this.pruneLocation);

    return vehicles;
  }

  async findById(user: UserEntity, companyId: number, id: number) {
    const vehicle = await this.locationRepository.findByCompanyIdAndId(
      companyId,
      id,
    );

    this.pruneLocation(vehicle);

    return vehicle;
  }

  async findOrCreate(
    user: UserEntity,
    companyId: number,
    id: number,
    dto: UpsertLocationDto,
  ) {
    let entity: LocationEntity = null;

    if (id) {
      entity = await this.locationRepository.findByCompanyIdAndId(
        companyId,
        id,
      );

      if (!entity)
        throw new HttpException(
          { errors: 'Location not found' },
          HttpStatus.BAD_REQUEST,
        );

      return entity;
    }

    if ('id' in dto) {
      delete dto['id'];
    }

    if (Object.keys(dto).length === 0 || !dto.street)
      throw new HttpException(
        { errors: 'Unable to create location from empty object' },
        HttpStatus.BAD_REQUEST,
      );

    entity = await this.locationRepository.findByCompanyIdAndStreet(
      companyId,
      dto.street,
    );

    if (dto.street) {
      //return this.update(user, companyId, entity.id, dto);
      return entity;
    }

    return this.create(user, companyId, dto);
  }
}
