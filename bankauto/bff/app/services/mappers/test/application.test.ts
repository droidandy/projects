import {
  ApplicationMapper,
  ApplicationCreditMapper,
  ApplicationInsuranceMapper,
  ApplicationTradeInMapper,
  ApplicationVehicleMapper,
  ApplicationInstalmentMapper,
  ApplicationC2cMapper,
  ApplicationSimpleCreditMapper,
} from '../application.mapper';
import {
  ApplicationDTOMock,
  ApplicationCreditDTOMock,
  ApplicationInsuranceDTOMock,
  ApplicationTradeInDTOMock,
  ApplicationVehicleDTOMock,
  ApplicationInstalmentDTOMock,
  ApplicationC2cDTOMock,
  ApplicationSimpleCreditDTOMock,
} from './mock/applicationDto.mock';
import {
  ApplicationMock,
  ApplicationCreditMock,
  ApplicationInsuranceMock,
  ApplicationTradeInMock,
  ApplicationVehicleMock,
  ApplicationInstalmentMock,
  ApplicationC2cMock,
  ApplicationSimpleCreditMock,
} from './mock/application.mock';

describe('Application', () => {
  it('Application Vehicle Mapping', () => {
    const r = ApplicationVehicleMapper({}, ApplicationVehicleDTOMock);
    expect(r).toEqual(ApplicationVehicleMock);
  });
  it('Application Credit Mapping', () => {
    const r = ApplicationCreditMapper({}, ApplicationCreditDTOMock);
    expect(r).toEqual(ApplicationCreditMock);
  });
  it('Application Simple Credit Mapping', () => {
    const r = ApplicationSimpleCreditMapper({}, ApplicationSimpleCreditDTOMock);
    expect(r).toEqual(ApplicationSimpleCreditMock);
  });
  it('Application Instalment Mapping', () => {
    const r = ApplicationInstalmentMapper({}, ApplicationInstalmentDTOMock);
    expect(r).toEqual(ApplicationInstalmentMock);
  });
  it('Application C2c Mapping', () => {
    const r = ApplicationC2cMapper({}, ApplicationC2cDTOMock);
    expect(r).toEqual(ApplicationC2cMock);
  });
  it('Application TradeIn Mapping', () => {
    const r = ApplicationTradeInMapper({}, ApplicationTradeInDTOMock);
    expect(r).toEqual(ApplicationTradeInMock);
  });
  it('Application Insurance Mapping', () => {
    const r = ApplicationInsuranceMapper({}, ApplicationInsuranceDTOMock);
    expect(r).toEqual(ApplicationInsuranceMock);
  });
  it('Application Base Mapping', () => {
    const r = ApplicationMapper({}, ApplicationDTOMock);
    expect(r).toEqual(ApplicationMock);
  });
});
