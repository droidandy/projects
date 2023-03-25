import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../user/entities/company.entity';
import { safeAssign } from '../../shared/utils';
import { UserEntity } from '../../user/entities/user.entity';
import { UpsertVehicleDto } from '../dto/upsert-vehicle.dto';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleRepository } from '../repositories/vehicle.repository';
//import DocumentUploadService from './document.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository, //private readonly documentUploadService: DocumentUploadService,
  ) {}

  private assignVehicleSafe(entity: VehicleEntity, dto: UpsertVehicleDto) {
    safeAssign(dto, entity, [
      'type',
      'type_other',
      'trailer_type',
      'trailer_type_other',
      'transmission_type',
      'make',
      'model',
      'year',
      'accessories',
      'accessory_other',
    ]);
  }

  private pruneVehicle(entity: VehicleEntity) {
    if (entity) {
      delete entity.company;
    }
  }
  async create(user: UserEntity, companyId: number, dto: UpsertVehicleDto) {
    let vehicle: VehicleEntity = new VehicleEntity();
    vehicle.company = new CompanyEntity(companyId);

    return await this.upsert(dto, vehicle);
  }
  async update(
    user: UserEntity,
    companyId: number,
    id: number,
    dto: UpsertVehicleDto,
  ) {
    let vehicle: VehicleEntity =
      await this.vehicleRepository.findByCompanyIdAndId(companyId, id);

    if (!vehicle) {
      throw new HttpException(
        { errors: 'Vehicle Id not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.upsert(dto, vehicle);
  }

  private async upsert(dto: UpsertVehicleDto, vehicle: VehicleEntity) {
    this.assignVehicleSafe(vehicle, dto);

    vehicle = await this.vehicleRepository.save(vehicle);

    // remove system fields
    this.pruneVehicle(vehicle);

    return vehicle;
  }

  async delete(user: UserEntity, companyId: number, id: number) {
    const vehicle = await this.vehicleRepository.findByCompanyIdAndId(
      companyId,
      id,
    );

    if (!vehicle)
      throw new HttpException(
        { errors: 'Vehicle Id not found' },
        HttpStatus.NOT_FOUND,
      );

    await this.vehicleRepository.delete(vehicle);
  }

  async findAll(user: UserEntity, companyId: number) {
    const vehicles = await this.vehicleRepository.findByCompanyId(companyId);

    vehicles.forEach(this.pruneVehicle);

    return vehicles;
  }

  async findById(user: UserEntity, companyId: number, id: number) {
    const vehicle = await this.vehicleRepository.findByCompanyIdAndId(
      companyId,
      id,
    );

    this.pruneVehicle(vehicle);

    return vehicle;
  }
}
