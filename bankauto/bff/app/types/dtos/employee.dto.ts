import { IdentityDTO, UserDTO } from './user.dto';
import { BrandDTO, OfficeBaseDTO } from './node.dto';

export interface EmployeeDTO extends IdentityDTO {
  company_id: number;
  status: number;
  brands?: BrandDTO[];
  sales_offices?: OfficeBaseDTO[];
  profile: UserDTO;
  is_deleted: 0 | 1;
}

export interface EmployeeBrandDTO {
  brand_id: number;
  user_id: number;
}

export interface EmployeeOfficeDTO {
  sales_office_id: number;
  user_id: number;
}
