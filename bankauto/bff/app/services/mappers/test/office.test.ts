import {
  CoordinatesMapper,
  OfficeMapper,
  OfficeOrganizationMapper,
  PhoneMapper,
  ServiceTimeDecode,
} from '../office.mapper';
import { CoordinatesMock, OfficeDetailedMock } from './mock/office.mock';
import { CoordinatesDTOMock, OfficeDetailedDTOMock } from './mock/officeDto.mock';
import { PhoneDTOMock } from './mock/phoneDto.mock';
import { PhoneMock } from './mock/phone.mock';
import { OfficeOrganizationMock } from './mock/officeOrganization.mock';
import { OfficeOrganizationDTOMock } from './mock/officeOrganizationDto.mock';

describe('Office', () => {
  it('Coordinates Mapping', () => {
    const r = CoordinatesMapper({}, CoordinatesDTOMock);
    expect(r).toEqual(CoordinatesMock);
  });
  it('Service Time Decoding', () => {
    const r = ServiceTimeDecode(OfficeDetailedDTOMock.service_time);
    expect(r).toEqual(OfficeDetailedMock.serviceTime);
  });
  it('Office Detailed Mapping', () => {
    const r = OfficeMapper({}, OfficeDetailedDTOMock);
    expect(r).toEqual(OfficeDetailedMock);
  });

  it('Office phone mapping', () => {
    const r = PhoneMapper({}, PhoneDTOMock);
    expect(r).toEqual(PhoneMock);
  });

  it('Office organization mapping', () => {
    const r = OfficeOrganizationMapper({}, OfficeOrganizationDTOMock);
    expect(r).toEqual(OfficeOrganizationMock);
  });
});
