import { CompanyEntity } from '../../user/entities/company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';

@EntityRepository(VehicleEntity)
export class VehicleRepository extends Repository<VehicleEntity> {
  findByCompanyIdAndId(companyId: number, id: number) {
    return this.findByCompanyAndId(new CompanyEntity(companyId), id);
  }
  findByCompanyAndId(company: CompanyEntity, id: number) {
    return this.findOne({ company, id });
  }

  findByCompanyId(companyId: number) {
    return this.findByCompany(new CompanyEntity(companyId));
  }

  findByCompany(company: CompanyEntity) {
    return this.find({ company });
  }
}
