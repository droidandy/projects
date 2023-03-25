import { AxiosResponse } from 'axios';
import API, { CancellableAxiosPromise } from 'api/request';
import {
  ApplicationInsuranceCalculationData,
  InsuranceAdvancedFormValues,
  InsuranceCalculation,
  InsuranceContactsFormValues,
  InsuranceDriverFormValues,
  InsuranceImport,
  InsuranceMainFormValues,
  InsurancePersonFormValues,
} from 'types/Insurance';
import {
  APPLICATION_INSURANCE_STATUS,
  APPLICATION_INSURANCE_TYPE,
  ApplicationInsurance,
  VEHICLE_TYPE,
} from '@marketplace/ui-kit/types';

function mapPersonValues(
  person: InsurancePersonFormValues,
  contacts: InsuranceContactsFormValues,
  isNeedDateStart = true,
) {
  const data = {
    phone: `7${contacts.phone}`,
    name: person.firstName,
    lastName: person.lastName,
    middleName: person.middleName,
    dateOfBirth: person.dateOfBirth,
    email: contacts.email,
    passportDateIssue: person.passportIssuedAt,
    passportIssuedBy: person.passportIssuer,
    passportNumber: person.passportNumber?.slice(5),
    passportSeries: person.passportNumber?.slice(0, 4),
    city: person.registration?.value?.city,
    country: person.registration?.value?.country,
    house: person.registration?.value?.house,
    building: person.registration?.value?.building || '',
    region: person.registration?.value?.region,
    street: person.registration?.value?.street,
    zipCode: person.registration?.value?.zipCode || '',
    kladrId: person.registration?.value?.kladrId,
  };
  if (isNeedDateStart) {
    // @ts-ignore
    data.dateStart = person.dateStart;
  }
  return data;
}

function mapDriverValues(driver: InsuranceDriverFormValues) {
  return {
    isMaried: true,
    name: driver.firstName,
    lastName: driver.lastName,
    middleName: driver.middleName,
    dateOfBirth: driver.dateOfBirth,
    sexCode: driver.sexCode,
    driverLicenseNumber: driver.driverLicenseNumber?.slice(5),
    driverLicenseSeries: driver.driverLicenseNumber?.slice(0, 4),
    drivingExperienceDateStart: driver.drivingExperienceDateStart,
  };
}

function mapVehicleValues(main: InsuranceMainFormValues, advanced: InsuranceAdvancedFormValues, isCasco: boolean) {
  const data = {
    vin: advanced.vin,
    price: main.price,
    production_year: main.productionYear?.value.toString(),
    ptsDate: advanced.ptsIssuedAt,
    ptsSeries: advanced.ptsSeries?.slice(0, 4),
    ptsNumber: advanced.ptsSeries?.slice(4),
    number: advanced.series,
    brand: {
      name: main.brand?.label,
      id: main.brand?.value,
    },
    model: {
      name: main.model?.label,
      id: main.model?.value,
    },
    type: main.vehicleType === VEHICLE_TYPE.USED ? 1 : 0,
    equipment: {
      power: main.power,
    },
    body_type: {
      name: main.bodyType?.label,
      id: main.bodyType?.value,
      // alias: main.bodyType?.alias
    },
  };
  if (isCasco) {
    // @ts-ignore
    data.mileage = main.vehicleType === VEHICLE_TYPE.USED ? 1 : 0;
  }
  return data;
}

function calculateInsurance(
  id: string | number,
  { contacts, insurant, owner, drivers, main, advanced }: ApplicationInsuranceCalculationData,
  type?: APPLICATION_INSURANCE_TYPE,
): Promise<AxiosResponse<InsuranceCalculation>> {
  const isCasco = type === APPLICATION_INSURANCE_TYPE.CASCO;
  const formData = {
    vehicle: main && advanced ? mapVehicleValues(main, advanced, isCasco) : undefined,
    insurant: mapPersonValues(insurant, contacts),
    owner: mapPersonValues(owner || insurant, contacts, false),
    drivers: drivers.map(mapDriverValues),
  };
  return API.put(`/application/insurance/${id}/calculate`, formData, {
    authRequired: true,
  });
}

function importInsurance(id: string | number): Promise<AxiosResponse<InsuranceImport>> {
  return API.put(
    `/application/insurance/${id}/import`,
    {},
    {
      authRequired: true,
    },
  );
}

function updateInsuranceStatus(
  id: string | number,
  status: APPLICATION_INSURANCE_STATUS,
): CancellableAxiosPromise<ApplicationInsurance> {
  return API.put(
    `/application/insurance/${id}/status`,
    { status },
    {
      authRequired: true,
    },
  );
}

function getInsuranceApplicationPaymentLinks(
  id: string | number,
  successUrl: string,
  failUrl: string,
): Promise<AxiosResponse<{ link: string }>> {
  return API.get(
    `/application/insurance-payment-links/${id}`,
    {
      successUrl,
      failUrl,
    },
    {
      authRequired: true,
    },
  );
}

function createInsuranceApplication(
  applicationUuid: string,
  vehicleId: number,
  type: APPLICATION_INSURANCE_TYPE,
): CancellableAxiosPromise<ApplicationInsurance> {
  return API.post(
    '/application/insurance',
    { application_uuid: applicationUuid, vehicle_id: vehicleId, type, drivers_number: 1 },
    {
      authRequired: true,
    },
  );
}

export {
  importInsurance,
  calculateInsurance,
  updateInsuranceStatus,
  createInsuranceApplication,
  getInsuranceApplicationPaymentLinks,
};
