import {
  AdditionalData,
  AddressData,
  EmploymentData,
  EmploymentSimpleData,
  PassportData,
  PersonalData,
  PersonBirthData,
  PersonGenderData,
  PersonPassportData,
} from 'types/CreditFormDataTypes';

export enum CreditStep {
  Calculation,
  Personal,
  Address,
  Additional,
  Employment,
}

export enum InstalmentStep {
  Personal,
  Address,
  Additional,
  Employment,
}

export type PersonalPassportData = PersonalData & PassportData;

export type PersonalInfoData = PersonalData & PersonGenderData;

export type PassportAddressData = PersonBirthData & PersonPassportData & AddressData;

export type FormData = PersonalPassportData | AddressData | AdditionalData | EmploymentData;

export type FormDataFis = PersonalInfoData | PassportAddressData | AdditionalData | EmploymentSimpleData;

export type StepsData = Partial<Record<CreditStep, FormData>>;

export type StepsDataFis = Partial<Record<CreditStep, FormDataFis>>;
