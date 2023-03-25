import { Address } from 'types/Address';
import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';
import { Application, VEHICLE_TYPE } from '@marketplace/ui-kit/types';

type RegistrationValue = AutocompleteOption<Address>;

export enum VEHICLE_OWNING_TYPE {
  CREDIT,
  OWNED,
}

export enum INSURANCE_FORM_TYPE {
  CASCO_OSAGO,
  CASCO,
  OSAGO,
}

export enum INSURANCE_DRIVERS_COUNT {
  MULTIDRIVE,
  SEVERAL,
}

export enum INSURANCE_PAYMENT {
  SUCCESS = 'success',
  FAIL = 'fail',
}

type FormValidation = {
  isValid: boolean;
};

export interface InsuranceFormName {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
}

export interface InsuranceFormBase extends InsuranceFormName {
  dateOfBirth: string | null;
  sexCode?: string;
}

export interface InsuranceFilterFormValues {
  city: string;
  formType: INSURANCE_FORM_TYPE;
  vehicleType: VEHICLE_TYPE;
  vehicleOwningType: VEHICLE_OWNING_TYPE;
}

export type InsuranceMainFormValues = InsuranceFilterFormValues & {
  insuranceType: INSURANCE_DRIVERS_COUNT;
  brand: (AutocompleteOption & { alias: string }) | null;
  model: (AutocompleteOption & { alias: string }) | null;
  productionYear: AutocompleteOption | null;
  bodyType: (AutocompleteOption & { alias: string }) | null;
  power: string | null;
  price: string | null;
};

export type InsuranceAdvancedFormValues = {
  registered: boolean;
  series: string | null;
  vin: string | null;
  ptsSeries: string | null;
  ptsIssuedAt: string | null;
  insuranceIssuedAt?: string | null;
};

export type InsuranceContactsFormValues = {
  email: string | null;
  phone: string | null;
};

export type InsurancePersonFormValues = InsuranceFormBase & {
  passportNumber?: string;
  passportIssuer?: string;
  passportIssuedAt?: string;
  registration?: RegistrationValue;
  disableName?: boolean;
  dateStart?: string | null;
};

export type InsuranceDriverFormValues = InsuranceFormBase & {
  drivingExperienceDateStart?: string;
  driverLicenseNumber?: string;
  dateStart?: string | null;
};

export type InsuranceFormType = {
  main: InsuranceMainFormValues;
  insurant: InsurancePersonFormValues;
  owner?: InsurancePersonFormValues;
  drivers: InsuranceDriverFormValues[];
  advanced: InsuranceAdvancedFormValues;
  contacts: InsuranceContactsFormValues;
};

export type ApplicationInsuranceCalculationData = {
  insurant: InsurancePersonFormValues;
  drivers: InsuranceDriverFormValues[];
  contacts: InsuranceContactsFormValues;
  owner?: InsurancePersonFormValues;
  main?: InsuranceMainFormValues;
  advanced?: InsuranceAdvancedFormValues;
};

export type InsuranceCalculation = {
  id: string | number;
  price?: number;
};

export type InsuranceImport = {
  maybe?: boolean;
};

export type ContactsFormState = InsuranceContactsFormValues & FormValidation;

export type DriverFormState = FormValidation & {
  values: InsuranceDriverFormValues;
  id: string;
};

export type InsuranceApplication = Partial<Application> & { insurance: Application['insurance'] };

export type AvailableUserInfo = {
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
};
