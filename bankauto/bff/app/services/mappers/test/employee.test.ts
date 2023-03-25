import { EmployeeBrandMapper, EmployeeMapper, EmployeeOfficeMapper } from '../../../services/mappers/employee.mapper';
import { EmployeeDTOMock } from './mock/employeeDto.mock';
import { EmployeeMock } from './mock/employee.mock';
import { EmployeeBrandMock } from './mock/employeeBrand.mock';
import { EmployeeBrandDTOMock } from './mock/employeeBrandDto.mock';
import { EmployeeOfficeDTOMock } from './mock/employeeOfficeDto.mock';
import { EmployeeOfficeMock } from './mock/employeeOffice.mock';

describe('Employee', () => {
  it('Employee Mapping', () => {
    const r = EmployeeMapper({}, EmployeeDTOMock);
    expect(r).toEqual(EmployeeMock);
  });

  it('Employee brand mapping', () => {
    const r = EmployeeBrandMapper({}, EmployeeBrandDTOMock);
    expect(r).toEqual(EmployeeBrandMock);
  });

  it('Employee office mapping', () => {
    const r = EmployeeOfficeMapper({}, EmployeeOfficeDTOMock);
    expect(r).toEqual(EmployeeOfficeMock);
  });
});
