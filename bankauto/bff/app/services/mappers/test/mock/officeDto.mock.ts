import { CoordinatesDTO, OfficeDTO } from '../../../../types/dtos/office.dto';
import { CompanyDTOMock, OfficeBaseDTOMock } from './nodeDto.mock';

export const CoordinatesDTOMock: CoordinatesDTO = {
  latitude: 1.75,
  longitude: 2.25,
};

export const OfficeDetailedDTOMock: OfficeDTO = {
  ...OfficeBaseDTOMock,
  ...CoordinatesDTOMock,
  service_time:
    '[{"isActive":true,"timeFrom":"09:00","timeTill":"20:00"},{"isActive":true,"timeFrom":"09:00","timeTill":"20:00"},{"isActive":true,"timeFrom":"09:00","timeTill":"20:00"},{"isActive":true,"timeFrom":"09:00","timeTill":"20:00"},{"isActive":true,"timeFrom":"09:00","timeTill":"20:00"},{"isActive":true,"timeFrom":"10:00","timeTill":"19:00"},{"isActive":true,"timeFrom":"10:00","timeTill":"19:00"}]',
  company: CompanyDTOMock,
  fis_office_id: 1,
};
