import { IDAddressDTO } from '../Address';

export interface IDCustomerIdentityDTO {
  // имя
  nameFirst: string;
  // отчество
  nameMiddle: string;
  // фамилия
  nameLast: string;
}

export interface IDCustomerContactDTO {
  phone?: string;
  email?: string;
  emailReport?: string;
}

export type IDCustomerAddressDTO = {
  [T in EDCustomerAddressType]: IDAddressDTO
};

export interface IDCustomerPersonalDTO {
  snils?: string;
  inn: string;
}

export interface IDCustomerPassportDTO extends IDCustomerIdentityDTO {
  // серия
  serial: string;
  // номер
  number: string;
  // дата выдачи
  issueDate: Date;
  // код подразделения
  issueDepartCode: string;
  // кто выдал
  issueDepartName: string;
  // дата рождения
  birthDate: Date;
  // место рождения (maybe IDAddress?)
  birthPlace: string;
  // пол
  gender: EDCustomerGender;
}

export type TDCustomerEditField = keyof IDCustomerPassportDTO | keyof IDCustomerContactDTO | keyof IDCustomerPersonalDTO
| keyof IDCustomerAddressDTO | keyof IDAddressDTO | keyof typeof EDCustomerAddressType;

export interface IDCustomerAccountDTO extends IDCustomerContactDTO {
  id: string;
  Name: string;
  Login: string;
  State: EDCustomerAccountState;
  Avatar?: string;
  // IsMustChangePassword: boolean;
}

export enum EDCustomerAddressType {
  Actual = 'Actual',
  Register = 'Register',
  Postal = 'Postal',
  Birth = 'Birth',
}

export enum EDCustomerAccountState {
  Unknown = 0,
  Checked = 1,
  Unchecked = 2,
  Registered = 3,
  Unregistered = 4
}

export enum EDCustomerInterviewState {
  Unknown = 0,
  Present = 1,
}

export enum EDCustomerGender {
  Unknown,
  Female,
  Male,
}

export interface IDCustomerPreferenceMap { [key: string]: string };
