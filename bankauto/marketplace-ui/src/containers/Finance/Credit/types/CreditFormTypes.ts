import { SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { AdditionalData, AddressData, EmploymentData, PassportData, PersonalData } from 'types/CreditFormDataTypes';

export interface CreditData {
  amount: number;
  term: number;
  subtype: SimpleCreditSubtype;
  rate: number;
  monthlyPayment: number;
  vehiclePrice?: number;
  initialPayment?: number;
}

export enum CreditStep {
  Personal,
  Passport,
  Address,
  Additional,
  Employment,
}

export enum SimpleCreditStep {
  Personal,
  Passport,
  Additional,
  Employment,
  Final,
}

export type FormData = PersonalData | PassportData | AddressData | EmploymentData | AdditionalData;

export type StepsData = Partial<Record<CreditStep, FormData>>;

export type SimpleCreditStepsData = Partial<Record<SimpleCreditStep, FormData>>;

export type CreditMainInfoData = PersonalData & PassportData & AddressData;
