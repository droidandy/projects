import {
  BasicSimpleCreditParamsDTO,
  AdditionalSimpleCreditParamsDTO,
  EmploymentSimpleCreditParamsDTO,
  CreateSimpleCreditParamsDTO,
} from 'dtos/SimpleCreditDTO';
import { CreditPurpose } from 'types/CreditPurpose';
import { SimpleCreditStepsApplicationParamsDTO } from 'dtos/SimpleCreditStepsApplicationParamsDTO';
import { CreditData, CreditMainInfoData, StepsData } from 'containers/Finance/Credit/types/CreditFormTypes';
import { LeadSourceInfo } from 'types/LeadSourceInfo';
import { LeadSourceInfoDTO } from 'dtos/LeadSourceInfoDTO';
import { getLeadInfo } from 'helpers/cookies';
import { getCreditInsurances } from 'helpers/getCreditInsurance';
import { calculateInsurance } from 'helpers/calculateInsurance';
import { CREDIT_INFO } from 'constants/credit';
import { AdditionalData, EmploymentData } from 'types/CreditFormDataTypes';

const EDUCATION_TYPE_MAP: Record<string, string> = {
  '6': '1',
  '7': '2',
  '5': '3',
  '4': '4',
  '3': '5',
  '2': '6',
  '1': '7',
};

const ORGANISATION_ACTIVITY_MAP: Record<string, string> = {
  '16': '1',
  '11': '2',
  '8': '3',
  '18': '4',
  '9': '5',
  '1': '6',
  '4': '7',
  '19': '8',
  '6': '9',
  '14': '10',
  '15': '11',
  '2': '12',
  '7': '13',
  '17': '14',
  '3': '15',
  '5': '16',
  '10': '17',
  '13': '18',
  '12': '19',
  '20': '20',
  '21': '21',
};

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

const GENDER_MAP: Record<string, string> = {
  male: 'м',
  female: 'ж',
};

function creditCreateMapper(values: CreditData): CreateSimpleCreditParamsDTO {
  const insurance = calculateInsurance(values.amount, values.term);
  const creditAmountWithInsurance = values.amount + insurance;
  const amount =
    creditAmountWithInsurance > CREDIT_INFO.maxStandaloneAmount ? values.amount - insurance : values.amount;

  return {
    amount,
    term: values.term,
    subtype: values.subtype,
    rate: values.rate,
    monthly_payment: values.monthlyPayment,
    vehicle_cost: values.vehiclePrice,
    initial_payment: values.initialPayment,
    utm: utmDataMapper(getLeadInfo()),
  };
}

function creditMainInfoMapper(values: CreditMainInfoData, amount: number, term: number): BasicSimpleCreditParamsDTO {
  return {
    actual_address_dadata: values.addressMatches ? values.regAddress?.value : values.factAddress?.value,
    registration_address_dadata: values.regAddress?.value,
    passport_series: values.passport.slice(0, 4),
    passport_number: values.passport.slice(4, values.passport.length),
    passport_issuer_code: values.passportIssuerCode,
    passport_issued_at: values.passportIssuedAt,
    passport_issuer: values.passportIssuer,
    passport_birthday: values.birthDate,
    passport_birth_place: values.birthPlace,
    passport_patronymic: values.patronymic,
    passport_surname: values.lastName,
    passport_name: values.firstName,
    passport_gender: GENDER_MAP[values.gender],
    current_email_attribute: values.email,
    current_msisdn_attributes: `7${values.phone}`,
    insurances: getCreditInsurances(amount, term),
  };
}

function additionalDataMapper(values: AdditionalData, creditPurpose: CreditPurpose): AdditionalSimpleCreditParamsDTO {
  return {
    full_name_changed: 0,
    previous_passport: 0,
    education_type: +EDUCATION_TYPE_MAP[values.educationType],
    marital_status: +values.maritalStatus,
    second_document_type: +values.additionalDocumentType,
    loan_purpose: +creditPurpose,
    additional_phone: `7${values.additionalPhone}`,
  };
}

function employmentDataMapper(values: EmploymentData): EmploymentSimpleCreditParamsDTO {
  return {
    employment_type: +values.employmentType,
    organization_activity: values.employerActivity ? +ORGANISATION_ACTIVITY_MAP[values.employerActivity] : undefined,
    current_job_phone: values.employerPhone ? `7${values.employerPhone}` : undefined,
    current_job_address: {
      value: values.employerAddress?.label,
      data: values.employerAddress?.value?.data,
    },
    current_job_name: values.employerName
      ? {
          value: values.employerName?.label,
          data: values.employerName?.value?.data,
        }
      : undefined,
    current_job_experience: values.currentJobExperience ? +values.currentJobExperience : undefined,
    current_job_position:
      values.currentJobPosition && +values.currentJobPosition.value ? +values.currentJobPosition.value : 1,
    monthly_income: +values.monthlyIncome!,
    has_additional_income: !values.additionalIncome ? 0 : 1,
    monthly_outcome: +values.monthlyOutcome!,
    supporting_document_type: values.incomeProofDocumentType ? +values.incomeProofDocumentType : 6,
    lawyer_id: values.lawyerId || undefined,
    lawyer_region: values.lawyerRegion || undefined,
    lawyer_license: values.lawyerLicense || undefined,
    additional_monthly_income: +values.additionalIncome! || 0,
  };
}

function getStepsMappedData(step: number, payload: StepsData): SimpleCreditStepsApplicationParamsDTO {
  return {
    frontend_step: step,
    frontend_data: JSON.stringify(payload),
  };
}

export {
  creditCreateMapper,
  creditMainInfoMapper,
  employmentDataMapper,
  additionalDataMapper,
  getStepsMappedData,
  utmDataMapper,
};
