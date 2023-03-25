import { OfficeBase } from '@marketplace/ui-kit/types/Node';
import {
  Coordinates,
  Office,
  OfficeOrganization,
  Phone,
  ServiceTime,
  WorkHours,
} from '@marketplace/ui-kit/types/Office';
import { WEEK } from '@marketplace/ui-kit/types/Enum';
import { CoordinatesDTO, OfficeDTO, OfficeOrganizationDTO, PhoneDTO } from '../../types/dtos/office.dto';
import { CityMapper, CompanyMapper, OfficeBaseMapper } from './node.mapper';
import { pipeMapper } from './utils';

export const CoordinatesMapper = <T>(item: T, dto: CoordinatesDTO): T & Coordinates => ({
  ...item,
  latitude: dto.latitude,
  longitude: dto.longitude,
});

export const ServiceTimeDecode = (json: string): ServiceTime => {
  const a: WorkHours[] = JSON.parse(json);
  return a.reduce((s, i, k) => ({ ...s, [k as WEEK]: i }), {} as ServiceTime);
};

export const OfficeMapper = pipeMapper(
  CoordinatesMapper,
  OfficeBaseMapper,
  <T extends OfficeBase & Coordinates>(
    item: T,
    { service_time: serviceTime, company, city, fis_office_id }: OfficeDTO,
  ): Office => ({
    ...item,
    fisOfficeId: fis_office_id,
    serviceTime: ServiceTimeDecode(serviceTime),
    company: CompanyMapper({}, company),
    city: city ? CityMapper({}, city) : undefined,
  }),
);

export const PhoneMapper = <T>(item: T, { id, number, sales_office_id }: PhoneDTO): T & Phone => ({
  ...item,
  id,
  number,
  salesOfficeId: sales_office_id,
});

export const OfficeOrganizationMapper = <T>(item: T, { id, name }: OfficeOrganizationDTO): T & OfficeOrganization => ({
  ...item,
  id,
  name,
});
