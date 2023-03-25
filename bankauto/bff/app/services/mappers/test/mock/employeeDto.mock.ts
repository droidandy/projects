import { EmployeeDTO } from '../../../../types/dtos/employee.dto';
import { IdentityDTOMock, UserDTOMock } from './userDto.mock';
import { BrandDTOMock, OfficeBaseDTOMock } from './nodeDto.mock';

export const EmployeeDTOMock: EmployeeDTO = {
  ...IdentityDTOMock,
  company_id: 1,
  status: 1,
  brands: [BrandDTOMock],
  sales_offices: [OfficeBaseDTOMock],
  profile: UserDTOMock,
  is_deleted: 0,
};
