import { ReactNode, SyntheticEvent } from 'react';
import { SelectOption } from '@marketplace/ui-kit/components/Select';
import {
  AdditionalIncomeType,
  CurrentJobCategory,
  EmploymentType,
  EmploymentTypeFis,
  SupportingDocument,
} from 'constants/creditEmployment';
import { WithOnBlur } from 'types/WithOnBlur';

export interface FormBase<Data> extends WithOnBlur<Data> {
  initialValues?: Data;
  onBack?: () => void;
  onSubmit: (values: Data) => void;
  children?: (handleSubmit: (event: SyntheticEvent) => void) => ReactNode;
}

export interface PersonalData {
  /** Фамилия */
  lastName: string;
  /** Имя */
  firstName: string;
  /** Отчество */
  patronymic: string;
  /** Телефон */
  phone: string;
  /** Email */
  email: string;
  /** Цель кредита */
  creditPurpose?: string;
}

export interface PersonGenderData {
  /** Пол */
  gender: string;
}

export interface PersonBirthData {
  /** Место рождения */
  birthPlace: string;
  /** Дата рождения */
  birthDate: string;
}

export interface PersonPassportData {
  /** Серия и номер */
  passport: string;
  /** Дата выдачи */
  passportIssuedAt: string;
  /** Код подразделения */
  passportIssuerCode: string;
  /** Кем выдан */
  passportIssuer: string;
}

export type PassportData = PersonBirthData & PersonGenderData & PersonPassportData;

export interface AddressData {
  /** Тип жилья */
  regAddressType?: string;
  /** Адрес */
  regAddress: any; // dadata object
  /** Адрес проживания */
  factAddress: any; // dadata object
  /** Совпадает с адресом проживания */
  addressMatches: boolean;
}

export type PassportAndAddressData = PersonBirthData & PersonGenderData & PersonPassportData & AddressData;

export interface PersonAdditionalInfoData {
  /** Образование */
  educationType: string;
  /** Семейный статус */
  maritalStatus: string;
  /** Кол-во лиц на иждивении */
  numberOfDependants?: number;
  /** Дополнительный документ */
  additionalDocumentType: string;
  /** Серия и номер дополнительного документа */
  additionalDocumentFullName?: string;
  /** Дата выдачи дополнительного документа */
  additionalDocumentIssuedAt?: string;
  /** Дополнительный телефон */
  additionalPhone?: string;
}

export interface ContactPersonData {
  /** Фамилия контактного лица */
  contactPersonsLastName: string;
  /** Имя контактного лица */
  contactPersonsFirstName: string;
  /** Отчество контактного лица */
  contactPersonsPatronymic: string;
  /** Кем приходится контактное лицо */
  contactPersonsType: string;
  /** Номер телефона контактного лица */
  contactPersonsPhone: string;
}

export type AdditionalData = PersonAdditionalInfoData & ContactPersonData;

export interface EmploymentData {
  /** Тип занятости  */
  employmentType: EmploymentType | '';
  /** Наименование или ИНН работодателя */
  employerName?: any; // dadata object
  /** Фактический адрес работодателя */
  employerAddress?: any; // dadata object
  /** Вид деятельности организации */
  employerActivity?: string;
  /** Официальный номер телефона */
  employerPhone?: string;
  /** Стаж на текущем месте */
  currentJobExperience?: string;
  /** Должность */
  currentJobPosition?: SelectOption | null;
  /** Категория должности */
  currentJobCategory?: CurrentJobCategory;
  /** Профессия */
  profession?: string;
  /** Тип подтверждающего документа */
  incomeProofDocumentType?: SupportingDocument;
  /** Доход в месяц, ₽ */
  monthlyIncome: number | null;
  /** Доп. доход, ₽ */
  additionalIncome?: number | null;
  /** Источник доп. дохода */
  additionalIncomeType?: AdditionalIncomeType;
  /** Расходы по кредитам в месяц, ₽ */
  monthlyOutcome?: number | null;
  lawyerId?: string;
  lawyerRegion?: string;
  lawyerLicense?: string;
}

export interface EmploymentSimpleData {
  /** Тип занятости  */
  employmentType: EmploymentTypeFis | '';
  /** Наименование или ИНН работодателя */
  employerName?: any; // dadata object
  /** Фактический адрес работодателя */
  employerAddress?: any; // dadata object
  /** Вид деятельности организации */
  employerActivity?: string;
  /** Официальный номер телефона */
  employerPhone?: string;
  /** Стаж на текущем месте */
  currentJobExperience?: string;
  /** Должность */
  currentJobPosition?: SelectOption | null;
  /** Категория должности */
  currentJobCategory?: CurrentJobCategory;
  /** Профессия */
  profession?: string;
  /** Доход в месяц, ₽ */
  monthlyIncome: number | null;
  /** Тип подтверждающего документа */
  incomeProofDocumentType?: SupportingDocument;
  /** Расходы по кредитам в месяц, ₽ */
  monthlyOutcome?: number | null;
  /** Реестровый номер */
  lawyerId?: string;
  /** Регион регистрации адвоката */
  lawyerRegion?: string;
  /** Лицензия */
  license?: string;
}
