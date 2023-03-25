import { EMPLOYEE_STATUS } from '@marketplace/ui-kit/types/Enum';
import { Employee } from '@marketplace/ui-kit/types/Employee';
import { IdentityMock, UserMock } from './user.mock';
import { BrandMock, OfficeBaseMock } from './node.mock';

export const EmployeeMock: Employee = {
  ...IdentityMock,
  companyId: 1,
  status: EMPLOYEE_STATUS.ACTIVE,
  brands: [BrandMock],
  offices: [OfficeBaseMock],
  profile: UserMock,
  isDeleted: false,
};
