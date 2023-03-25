import { EAccountValidationErrorType } from '../../enums/onboarding/account-validation-error-type';
import { CreateApplicationInput } from '../../inputs/create-application';
import { EUnsupportedAccountErrorReason } from '../../enums/onboarding/unsupported-account-error-reason';

const MESSAGES = {
  MISSING_MAILING_ADDRESS_FIELDS: {
    mailingAddressCountry: 'Field \'mailingAddressCountry\' required when mailing address is not same as residential address',
    mailingAddressCity: 'Field \'mailingAddressCity\' required when mailing address is not same as residential address',
    mailingAddressLine1: 'Field \'mailingAddressLine1\' required when mailing address is not same as residential address',
    mailingAddressState: 'Field \'mailingAddressState\' required when mailing address is not same as residential address',
    mailingAddressZipCode: 'Field \'mailingAddressZipCode\' required when mailing address is not same as residential address',
  },
  MISSING_TRUSTED_CONTACT_FIELDS: {
    trustedContactFirstName: '\'FirstName\' is required for trusted contact',
    trustedContactLastName: '\'LastName\' is required for trusted contact',
    trustedContactPhoneNumber: '\'PhoneNumber\' is required for trusted contact',
    trustedContactEmail: '\'Email\' is required for trusted contact',
    trustedContactCountry: '\'Country\' is required for trusted contact',
    trustedContactAddressLine1: '\'AddressLine1\' is required for trusted contact',
    trustedContactCity: '\'City\' is required for trusted contact',
    trustedContactState: '\'State\' is required for trusted contact',
    trustedContactZipCode: '\'ZipCode\' is required for trusted contact',
    trustedContactDisclosureAgreement: '\'TrustedContactDisclosureAgreement\' should be accepted',
  },
  MISSING_TRANSFER_ON_DEATH_FIELDS: {
    married: 'Please provide \'married\' field for Transfer of Death form',
    spouseSignatureAgreement: 'Spouse signature agreement should be accepted for Transfer of Death form',
    spouseSignature: 'Spouse signature should be provided for Transfer of Death form',
    primaryBeneficiaryLegalName: 'Primary beneficiary legal name should be provided for Transfer of Death form',
    primaryBeneficiaryDateOfBirth: 'Primary beneficiary date of birth should be provided for Transfer of Death form',
    primaryBeneficiarySsn: 'Primary beneficiary SSN should be provided for Transfer of Death form',
    primaryBeneficiarySharePercentage: 'Primary beneficiary share percentage should be provided for Transfer of Death form',
    primaryBeneficiaryMailingAddressCountry: 'Primary beneficiary country should be provided for Transfer of Death form',
    primaryBeneficiaryMailingAddressLine1: 'Primary beneficiary address line 1 should be provided for Transfer of Death form',
    primaryBeneficiaryMailingAddressCity: 'Primary beneficiary address city should be provided for Transfer of Death form',
    primaryBeneficiaryMailingAddressState: 'Primary beneficiary address state should be provided for Transfer of Death form',
    primaryBeneficiaryMailingAddressZipCode: 'Primary beneficiary address zip code should be provided for Transfer of Death form',
  },
  MISSING_EMPLOYMENT_STATUS_FIELDS: {
    employer: 'Employer name should be provided',
    position: 'Employee position should be provided',
    sourceOfIncome: 'Source of income should be provided for unemployed',
  },
  INVALID_DATE_OF_BIRTH: {
    dateOfBirth: 'Please enter age in the following range: 0 < age < 100',
  },
  TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER: {
    doYouWantToAddTrustedContactInformation: 'You should add trusted contact information if you are 55 or older',
  },
  MISSING_TRANSFER_ON_DEATH_AGREEMENT: {
    transferOnDeathBeneficiaryDesignation: 'Transfer on Death Beneficiary Designation should be accepted',
  },
  MISSING_CUSTOMER_AGREEMENT: {
    customerAccountAgreement: 'Customer Account Agreement should be accepted',
  },
  MISSING_CUSTOMER_CUSTODIAN_AGREEMENT: {
    customerAccountAgreementCustodian: 'Customer Account Agreement Custodian should be accepted',
  },
  MISSING_PRIMARY_APPLICANT_SIGNATURE: {
    signaturePrimaryApplicant: 'Primary Applicant signature should be provided',
  },
  MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT: {
    nameOfThirdPartyAgent: 'Name of trading agent required if authorization granted',
  },
  NON_DOMESTIC_ACCOUNT: {
    accountLocationType: 'At the current moment we support only domestic applications',
  },
  NON_US_CITIZEN: {
    citizenshipCountry: 'Unfortunately, at the current moment we support US citizens only',
  },
  POLITICAL_OR_PUBLIC_PERSON: {
    isAccountMaintainedForPoliticalOrPublicPerson:
      'At the current moment we do not support access for a current or former politically exposed person or public official',
  },
  PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER: {
    isAccountHolderIsControlHolderOfPublicCompany:
      'At the current moment we do not support access for control persons of a publicly traded company? (Director, Officer, or 10% Stock Holder)',
  },
  AFFILIATED_WITH_EXCHANGE_OR_FINRA: {
    isAffiliatedWithExchangeOrFINRA: 'At the current moment we do not support users affiliated with stock exchanges or FINRA',
  },
};

export const getErrorMessage = (reason: EAccountValidationErrorType | EUnsupportedAccountErrorReason, fieldName: keyof CreateApplicationInput): string => {
  const errorsByType = MESSAGES[(reason as keyof typeof MESSAGES)];
  return errorsByType[fieldName as keyof typeof errorsByType];
};
