import { CreditSubtype, VEHICLE_TYPE } from '@marketplace/ui-kit/types';

import { PRODUCT_TYPE } from 'constants/credit';
import { CreditMainInfoData, StepsData } from 'containers/Finance/Credit/types/CreditFormTypes';

import { AdditionalCreditApplicationParamsDTO } from 'dtos/AdditionalCreditApplicationParamsDTO';
import { BasicCreditApplicationParamsDTO } from 'dtos/BasicCreditApplicationParamsDTO';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';
import { EmploymentCreditApplicationParamsDTO } from 'dtos/EmploymentCreditApplicationParamsDTO';
import { CreditStepsApplicationParamsDTO } from 'dtos/CreditStepsApplicationParamsDTO';
import { AdditionalData, EmploymentData } from 'types/CreditFormDataTypes';
import { LeadSourceInfo } from 'types/LeadSourceInfo';
import { LeadSourceInfoDTO } from 'dtos/LeadSourceInfoDTO';
import { getLeadInfo } from 'helpers/cookies';
import { EmploymentType } from 'constants/creditEmployment';
import { getEmploymentRelatedFields } from 'helpers/credit';
import { SelectOption } from 'components/Select/Select';

function utmDataMapper(utm: LeadSourceInfo | null): LeadSourceInfoDTO | undefined {
  if (!utm) return undefined;
  return {
    utm_source: utm.utmSource,
    utm_content: utm.utmContent,
    utm_medium: utm.utmMedium,
    utm_campaign: utm.utmCampaign,
    utm_term: utm.utmTerm,
    userId: utm.userId,
    client_id: utm.clientId,
    utm_user_agent: utm.utmUserAgent,
  };
}

interface CreatedMappedDataProps {
  vehicleId: number;
  salesOfficeId: number;
  initialPayment: number;
  vehiclePrice: number;
  term: number;
  discount?: number;
  monthlyPayment: number;
  rate: number;
}
export function getCreateMappedData({
  vehicleId,
  salesOfficeId,
  initialPayment,
  vehiclePrice,
  term,
  discount,
  monthlyPayment,
  rate,
}: CreatedMappedDataProps): CreateCreditApplicationParamsDTO {
  const amount = vehiclePrice - initialPayment;
  return {
    vehicle_id: vehicleId,
    sales_office_id: salesOfficeId,
    initial_payment: initialPayment,
    amount,
    vehicle_cost: vehiclePrice,
    term,
    discount,
    subtype: CreditSubtype.BDA_C2C,
    monthly_payment: monthlyPayment,
    rate,
    utm: utmDataMapper(getLeadInfo()),
  };
}

export function getBasicMappedData(data: CreditMainInfoData, term: number): BasicCreditApplicationParamsDTO {
  return {
    product_type: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_C2C,
    vehicle_state: VEHICLE_TYPE.USED,
    vehicle_type: 1,
    brand_model: 484,
    registration_address_accommodation_type: +data.regAddressType!,
    registration_address_dadata: data.regAddress.value,
    actual_address_dadata: data.addressMatches ? data.regAddress.value : data.factAddress.value,
    passport_series_number: data.passport,
    passport_issuer_code: data.passportIssuerCode,
    passport_issued_at: data.passportIssuedAt,
    passport_issuer: data.passportIssuer,
    passport_birthday: data.birthDate,
    passport_birth_place: data.birthPlace,
    passport_patronymic: data.patronymic,
    passport_surname: data.lastName,
    passport_name: data.firstName,
    passport_gender: data.gender,
    current_email_attribute: data.email,
    current_msisdn_attributes: `7${data.phone}`,
    insurances: [{ type: 1, company_name: 1, tariff: 3, term, included: true, amount: 1000 }],
  };
}

export function getAdditionalMappedData(additional: AdditionalData): AdditionalCreditApplicationParamsDTO {
  return {
    family_type_cid: +additional.maritalStatus,
    dependent_person_count: additional.numberOfDependants ?? 0,
    education_cid: +additional.educationType,
    contact_person_full_name: `${additional.contactPersonsLastName} ${additional.contactPersonsFirstName} ${additional.contactPersonsPatronymic}`,
    contact_person_phone_number: +`7${additional.contactPersonsPhone}`,
    contact_person_type: +additional.contactPersonsType,
    additional_document_type_cid: +additional.additionalDocumentType,
  };
}

export function getEmploymentMappedData(employment: EmploymentData): EmploymentCreditApplicationParamsDTO {
  const { employerActivity, currentJobCategory, currentJobPosition, profession } = getEmploymentRelatedFields(
    employment.employmentType as EmploymentType,
    {
      employerActivity: employment.employerActivity,
      currentJobCategory: employment.currentJobCategory,
      currentJobPosition: employment.currentJobPosition as SelectOption,
      profession: employment.profession,
    },
  );
  const hasAdditionalIncome = employment.additionalIncome && employment.additionalIncomeType;
  const data: EmploymentCreditApplicationParamsDTO = {
    occupation_form_cid: +employment.employmentType,
    name_dadata: employment.employerName?.value,
    address_dadata: employment.employerAddress?.value,
    official_phones: +`7${employment.employerPhone}`,
    position_cid: currentJobPosition,
    month_income: employment.monthlyIncome ?? 0,
    additional_income: hasAdditionalIncome ? +employment.additionalIncome! : undefined,
    additional_income_type: hasAdditionalIncome ? +employment.additionalIncomeType! : undefined,
    loan_payments: employment.monthlyOutcome ?? 0,
    lawyer_id: '',
    lawyer_region: '',
    lawyer_licence: '',
  };
  if (employment.employerActivity) data.business_line_cid = employerActivity;
  if (employment.currentJobExperience) data.experience_cid = +employment.currentJobExperience;
  if (employment.currentJobCategory) data.qualification_cid = currentJobCategory;
  if (employment.profession) data.profession_cid = profession;
  if (employment.incomeProofDocumentType) data.income_proof_document_cid = +employment.incomeProofDocumentType;
  return data;
}

export function getStepsMappedData(step: number, payload: StepsData): CreditStepsApplicationParamsDTO {
  return {
    frontend_step: step,
    frontend_data: JSON.stringify(payload),
  };
}
