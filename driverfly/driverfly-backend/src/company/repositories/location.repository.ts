import { CompanyEntity } from '../../user/entities/company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';

@EntityRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {
  findByCompanyIdAndId(companyId: number, id: number) {
    return this.findByCompanyAndId(new CompanyEntity(companyId), id);
  }
  findByCompanyAndId(company: CompanyEntity, id: number) {
    return this.findOne({ company, id });
  }

  findByCompanyIdAndStreet(companyId: number, street: string) {
    return this.findByCompanyAndStreet(new CompanyEntity(companyId), street);
  }

  findByCompanyAndStreet(company: CompanyEntity, street: string) {
    return this.findOne({ company, street });
  }

  findByCompanyId(companyId: number) {
    return this.findByCompany(new CompanyEntity(companyId));
  }

  findByCompany(company: CompanyEntity) {
    return this.find({ company });
  }
}
