import { CityDTO, CompanyDTO, NodeIdDTO, OfficeBaseDTO } from './node.dto';

export interface CoordinatesDTO {
  latitude: number;
  longitude: number;
}

export interface OfficeDTO extends OfficeBaseDTO, CoordinatesDTO {
  service_time: string;
  company: CompanyDTO;
  fis_office_id: number | null;
  city?: CityDTO;
}

export interface OfficeCountDTO {
  count: number;
}

export type PhoneDTO = {
  id: number;
  number: string;
  sales_office_id: number;
};

export type OfficeOrganizationDTO = NodeIdDTO;
