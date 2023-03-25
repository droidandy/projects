import { Identity } from '@marketplace/ui-kit/types/User';
import { EmployeeBrandDTO, EmployeeDTO, EmployeeOfficeDTO } from '../../types/dtos/employee.dto';
import { Employee, EmployeeBrand, EmployeeOffice } from '@marketplace/ui-kit/types/Employee';
import { EMPLOYEE_STATUS } from '@marketplace/ui-kit/types/Enum';
import { IdentityMapper, UserMapper } from './user.mapper';
import { BrandMapper, OfficeBaseMapper } from './node.mapper';
import { pipeMapper } from './utils';

export const EmployeeMapper = pipeMapper(
  IdentityMapper,
  <T extends Identity>(item: T, dto: EmployeeDTO): T & Employee => ({
    ...item,
    status: dto.status === 1 ? EMPLOYEE_STATUS.ACTIVE : EMPLOYEE_STATUS.FIRED,
    companyId: dto.company_id,
    isDeleted: dto.is_deleted === null ? undefined : !!dto.is_deleted,
    profile: UserMapper({}, dto.profile),
    brands: dto.brands ? dto.brands.map((b) => BrandMapper({}, b)) : undefined,
    offices: dto.sales_offices ? dto.sales_offices.map((o) => OfficeBaseMapper({}, o)) : undefined,
  }),
);

export const EmployeeBrandMapper = <T>(item: T, dto: EmployeeBrandDTO): T & EmployeeBrand => ({
  ...item,
  employeeId: dto.user_id,
  brandId: dto.brand_id,
});

export const EmployeeOfficeMapper = <T>(item: T, dto: EmployeeOfficeDTO): T & EmployeeOffice => ({
  ...item,
  employeeId: dto.user_id,
  officeId: dto.sales_office_id,
});
