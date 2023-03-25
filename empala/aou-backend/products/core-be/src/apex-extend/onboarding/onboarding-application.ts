/* eslint-disable camelcase */
import dayjs from 'dayjs';
import { AccountInputValidationErrorMessage, UnsupportedAccountParameter } from '../../results/create-application';
import { CreateApplicationInput } from '../../inputs/create-application';
import { ECountry } from '../../enums/country';
import { EUnsupportedAccountErrorReason } from '../../enums/onboarding/unsupported-account-error-reason';
import { EAccountValidationErrorType } from '../../enums/onboarding/account-validation-error-type';
import { EAccountLocationType } from '../../enums/onboarding/account-location-type';
import { EEmploymentStatus } from '../../enums/onboarding/employment-status';
import { EDividendProceedsAction } from '../../enums/onboarding/divident-proceeds-action';
import {
  APEX_APPLICATION_QUESTIONS as APQ,
  CASH_ACCOUNT_TYPE_ANSWER,
  CASH_ACCOUNT_TYPE_QUESTION_ID,
  INDIVIDUAL_CUSTOMER_TYPE_ANSWER,
  INDIVIDUAL_CUSTOMER_TYPE_QUESTION_ID,
  IS_CURRENT_ADDRESS_US_NO_ANSWER,
  IS_CURRENT_ADDRESS_US_QUESTION_ID,
  IS_CURRENT_ADDRESS_US_YES_ANSWER,
  IS_CURRENT_MAILING_ADDRESS_US_NO_ANSWER,
  IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID,
  IS_CURRENT_MAILING_ADDRESS_US_YES_ANSWER,
  IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_NO_ANSWER,
  IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID,
  IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_YES_ANSWER,
  IS_TRUSTED_CONTACT_LOCATED_IN_US_NO_ANSWER,
  IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID,
  IS_TRUSTED_CONTACT_LOCATED_IN_US_YES_ANSWER,
  OPTIONS_TRADING_ANSWER,
  OPTIONS_TRADING_QUESTION_ID,
  PRIMARY_BENEFICIARY_QUESTION_ID,
  PRIMARY_BENEFICIARY_YES_ANSWER,
  SECOND_BENEFICIARY_NO_ANSWER,
  SECOND_BENEFICIARY_QUESTION_ID,
  US_CITIZEN_QUESTION_ID,
  US_CITIZEN_YES_ANSWER,
} from './application-questions-info';
import { getErrorMessage } from './error-messages';

const APEX_TRUSTED_CONTACT_INFO_REQUIRED_AGE = 55;
const APEX_FORM_DATE_FORMAT = 'MM/DD/YYYY';

export interface ApplicationAnswer {
  data: string | number;
  question_id: number;
}

interface ApexAnswerMultipleResponseSuccessItem {
  question_id: number;
  answer: {
    id: number;
    application_id: number;
    question_id: number;
    option_id: number | null;
    data: string | number | any;
    created_at: string;
    updated_at: string;
  };
}

interface ApexAnswerMultipleResponseErrorItem {
  question_id: number;
  errors: {
    data: string[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApexAnswerMultipleResponse {
  answers: {
    success: ApexAnswerMultipleResponseSuccessItem[];
    error: ApexAnswerMultipleResponseErrorItem[];
  };
}

export class OnboardingApplication {
  private form: ApplicationAnswer[];

  private unsupportedAccountErrors: UnsupportedAccountParameter[];

  private validationErrors: AccountInputValidationErrorMessage[];

  private customerAge: number;

  public constructor() {
    this.form = [];
    this.unsupportedAccountErrors = [];
    this.validationErrors = [];
  }

  public fillForm(input: CreateApplicationInput) {
    this.addDefaults();
    this.addIdentitySection(input);
    this.addCitizenshipWithSsn(input);
    this.addHomeAddress(input);
    this.addDisclosures(input);
    this.addAccountLocation(input);
    this.addTrustedContact(input);
    this.addEmployment(input);
    this.addInvestingProfile(input);
    this.addServiceProfile(input);
    this.addTransferOfDeath(input);
    this.addLegalDisclosures(input);
    this.addSignatures(input);
  }

  public getForm() {
    return this.form;
  }

  public getErrors() {
    return {
      unsupportedAccountErrors: this.unsupportedAccountErrors,
      validationErrors: this.validationErrors,
    };
  }

  public addDefaults = () => {
    // Customer type
    this.addAnswer(INDIVIDUAL_CUSTOMER_TYPE_QUESTION_ID, INDIVIDUAL_CUSTOMER_TYPE_ANSWER);
    // Account type
    this.addAnswer(CASH_ACCOUNT_TYPE_QUESTION_ID, CASH_ACCOUNT_TYPE_ANSWER);
    //  "Do you plan to trade options in this account?"
    this.addAnswer(OPTIONS_TRADING_QUESTION_ID, OPTIONS_TRADING_ANSWER);
  };

  public addIdentitySection(input: CreateApplicationInput) {
    this.addAnswer(APQ.firstName.id, input.firstName);
    this.addAnswer(APQ.lastName.id, input.lastName);
    this.addAnswer(APQ.dateOfBirth.id, dayjs(input.dateOfBirth).format(APEX_FORM_DATE_FORMAT));
    this.addAnswer(APQ.phoneNumber.id, input.phoneNumber);
    this.addAnswer(APQ.email.id, input.email);

    if (input.middleName) {
      this.addAnswer(APQ.middleName.id, input.middleName);
    }
    this.validateDateOfBirth(input.dateOfBirth);
  }

  public addCitizenshipWithSsn(input: CreateApplicationInput) {
    // TODO: add permanent residents and visa owners later, for mock version we support US citizens only
    if (input.citizenshipCountry === ECountry.USA) {
      this.addAnswer(US_CITIZEN_QUESTION_ID, US_CITIZEN_YES_ANSWER);
      this.addAnswer(APQ.ssn.id, input.ssn);
    } else {
      this.addUnsupportedAccountTypeError(EUnsupportedAccountErrorReason.NON_US_CITIZEN, 'citizenshipCountry');
    }
  }

  public addHomeAddress(input: CreateApplicationInput) {
    if (input.residentialAddressCountry === ECountry.USA) {
      this.addAnswer(IS_CURRENT_ADDRESS_US_QUESTION_ID, IS_CURRENT_ADDRESS_US_YES_ANSWER);
    } else {
      this.addAnswer(IS_CURRENT_ADDRESS_US_QUESTION_ID, IS_CURRENT_ADDRESS_US_NO_ANSWER);
      this.addAnswer(APQ.residentialAddressCountry.id, input.residentialAddressCountry);
    }

    this.addAnswer(APQ.residentialAddressLine1.id, input.residentialAddressLine1);
    this.addAnswer(APQ.residentialAddressCity.id, input.residentialAddressCity);
    this.addAnswer(APQ.residentialAddressState.id, input.residentialAddressState);
    this.addAnswer(APQ.residentialAddressZipCode.id, input.residentialAddressZipCode);
    this.addAnswer(
      APQ.isMailingAddressSameAsResidentialAddress.id,
      input.isMailingAddressSameAsResidentialAddress
        ? APQ.isMailingAddressSameAsResidentialAddress.answers.yes
        : APQ.isMailingAddressSameAsResidentialAddress.answers.no,
    );

    if (input.residentialAddressLine2) {
      this.addAnswer(APQ.residentialAddressLine2.id, input.residentialAddressLine2);
    }

    if (input.residentialAddressRegion) {
      this.addAnswer(APQ.residentialAddressRegion.id, input.residentialAddressRegion);
    }
    if (!input.isMailingAddressSameAsResidentialAddress && this.isMailingAddressFieldsValid(input)) {
      if (input.mailingAddressCountry === ECountry.USA) {
        this.addAnswer(IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID, IS_CURRENT_MAILING_ADDRESS_US_YES_ANSWER);
      } else {
        this.addAnswer(IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID, IS_CURRENT_MAILING_ADDRESS_US_NO_ANSWER);
        this.addAnswer(APQ.mailingAddressCountry.id, input.mailingAddressCountry);
      }
      this.addAnswer(APQ.mailingAddressLine1.id, input.mailingAddressLine1);
      this.addAnswer(APQ.mailingAddressCity.id, input.mailingAddressCity);
      this.addAnswer(APQ.mailingAddressState.id, input.mailingAddressState);
      this.addAnswer(APQ.mailingAddressZipCode.id, input.mailingAddressZipCode);

      if (input.mailingAddressLine2) {
        this.addAnswer(APQ.mailingAddressLine2.id, input.mailingAddressLine2);
      }

      if (input.mailingAddressRegion) {
        this.addAnswer(APQ.mailingAddressRegion.id, input.mailingAddressRegion);
      }
    }
  }

  public addDisclosures(input: CreateApplicationInput) {
    if (input.isAccountMaintainedForPoliticalOrPublicPerson) {
      this.addUnsupportedAccountTypeError(EUnsupportedAccountErrorReason.POLITICAL_OR_PUBLIC_PERSON, 'isAccountMaintainedForPoliticalOrPublicPerson');
    } else {
      this.addAnswer(APQ.isAccountMaintainedForPoliticalOrPublicPerson.id, APQ.isAccountMaintainedForPoliticalOrPublicPerson.answers.no);
    }

    if (input.isAccountHolderIsControlHolderOfPublicCompany) {
      this.addUnsupportedAccountTypeError(
        EUnsupportedAccountErrorReason.PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER,
        'isAccountHolderIsControlHolderOfPublicCompany',
      );
    } else {
      this.addAnswer(APQ.isAccountHolderIsControlHolderOfPublicCompany.id, APQ.isAccountHolderIsControlHolderOfPublicCompany.answers.no);
    }

    if (input.isAffiliatedWithExchangeOrFINRA) {
      this.addUnsupportedAccountTypeError(EUnsupportedAccountErrorReason.AFFILIATED_WITH_EXCHANGE_OR_FINRA, 'isAffiliatedWithExchangeOrFINRA');
    } else {
      this.addAnswer(APQ.isAffiliatedWithExchangeOrFINRA.id, APQ.isAffiliatedWithExchangeOrFINRA.answers.no);
    }

    if (input.isThirdPartyTradingAuthorizationGranted) {
      this.addAnswer(APQ.isThirdPartyTradingAuthorizationGranted.id, APQ.isThirdPartyTradingAuthorizationGranted.answers.yes);

      if (input.nameOfThirdPartyAgent && input.nameOfThirdPartyAgent.length > 0) {
        this.addAnswer(APQ.nameOfThirdPartyAgent.id, input.nameOfThirdPartyAgent);
      } else {
        this.addValidationError(EAccountValidationErrorType.MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT, 'nameOfThirdPartyAgent');
      }
    } else {
      this.addAnswer(APQ.isThirdPartyTradingAuthorizationGranted.id, APQ.isThirdPartyTradingAuthorizationGranted.answers.no);
    }
  }

  public addAccountLocation(input: CreateApplicationInput) {
    if (input.accountLocationType !== EAccountLocationType.DOMESTIC) {
      this.addUnsupportedAccountTypeError(EUnsupportedAccountErrorReason.NON_DOMESTIC_ACCOUNT, 'accountLocationType');
    } else {
      this.addAnswer(APQ.accountLocationType.id, APQ.accountLocationType.answers.domestic);
    }
  }

  public addTrustedContact(input: CreateApplicationInput) {
    if ((input.areYou55OrOlder || this.customerAge >= APEX_TRUSTED_CONTACT_INFO_REQUIRED_AGE) && !input.doYouWantToAddTrustedContactInformation) {
      this.addValidationError(EAccountValidationErrorType.TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER, 'doYouWantToAddTrustedContactInformation');
      return;
    }

    if (input.doYouWantToAddTrustedContactInformation && this.isTrustedContactFieldsValid(input)) {
      this.addAnswer(APQ.areYou55OrOlder.id, input.areYou55OrOlder ? APQ.areYou55OrOlder.answers.yes : APQ.areYou55OrOlder.answers.no);
      this.addAnswer(APQ.doYouWantToAddTrustedContactInformation.id, APQ.doYouWantToAddTrustedContactInformation.answers.yes);
      this.addAnswer(APQ.trustedContactFirstName.id, input.trustedContactFirstName);
      this.addAnswer(APQ.trustedContactLastName.id, input.trustedContactLastName);
      this.addAnswer(APQ.trustedContactPhoneNumber.id, input.trustedContactPhoneNumber);
      this.addAnswer(APQ.trustedContactEmail.id, input.trustedContactEmail);
      this.addAnswer(APQ.trustedContactAddressLine1.id, input.trustedContactAddressLine1);
      this.addAnswer(APQ.trustedContactCity.id, input.trustedContactCity);
      this.addAnswer(APQ.trustedContactState.id, input.trustedContactState);
      this.addAnswer(APQ.trustedContactZipCode.id, input.trustedContactZipCode);
      this.addAnswer(APQ.trustedContactDisclosureAgreement.id, APQ.trustedContactDisclosureAgreement.answers.yes);

      if (input.trustedContactCountry === ECountry.USA) {
        this.addAnswer(IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID, IS_TRUSTED_CONTACT_LOCATED_IN_US_YES_ANSWER);
      } else {
        this.addAnswer(IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID, IS_TRUSTED_CONTACT_LOCATED_IN_US_NO_ANSWER);
        this.addAnswer(APQ.trustedContactCountry.id, input.trustedContactCountry);
      }

      if (input.trustedContactAddressLine2) {
        this.addAnswer(APQ.trustedContactAddressLine2.id, input.trustedContactAddressLine2);
      }

      if (input.trustedContactRegion) {
        this.addAnswer(APQ.trustedContactRegion.id, input.trustedContactRegion);
      }
    } else {
      this.addAnswer(APQ.areYou55OrOlder.id, APQ.areYou55OrOlder.answers.no);
      this.addAnswer(APQ.doYouWantToAddTrustedContactInformation.id, APQ.doYouWantToAddTrustedContactInformation.answers.no);
    }
  }

  public addEmployment(input: CreateApplicationInput) {
    this.addAnswer(APQ.employmentStatus.id, APQ.employmentStatus.answers[input.employmentStatus]);

    if (input.employmentStatus === EEmploymentStatus.EMPLOYED) {
      if (input.employer) {
        this.addAnswer(APQ.employer.id, input.employer);
      } else {
        this.addValidationError(EAccountValidationErrorType.MISSING_EMPLOYMENT_STATUS_FIELDS, 'employer');
      }

      if (input.position) {
        this.addAnswer(APQ.position.id, input.position);
      } else {
        this.addValidationError(EAccountValidationErrorType.MISSING_EMPLOYMENT_STATUS_FIELDS, 'position');
      }
    }

    if (input.employmentStatus === EEmploymentStatus.UNEMPLOYED) {
      if (input.sourceOfIncome && input.sourceOfIncome.length > 0) {
        this.addAnswer(APQ.sourceOfIncome.id, input.sourceOfIncome);
      } else {
        this.addValidationError(EAccountValidationErrorType.MISSING_EMPLOYMENT_STATUS_FIELDS, 'sourceOfIncome');
      }
    }
  }

  public addInvestingProfile(input: CreateApplicationInput) {
    this.addAnswer(APQ.investingObjective.id, APQ.investingObjective.answers[input.investingObjective]);
    this.addAnswer(APQ.annualIncome.id, APQ.annualIncome.answers[input.annualIncome]);
    this.addAnswer(APQ.totalNetWorth.id, APQ.totalNetWorth.answers[input.totalNetWorth]);
    this.addAnswer(APQ.riskTolerance.id, APQ.riskTolerance.answers[input.riskTolerance]);
    this.addAnswer(APQ.investmentExperience.id, APQ.investmentExperience.answers[input.investmentExperience]);
    this.addAnswer(APQ.taxBracket.id, input.taxBracket);

    if (input.secondaryInvestingObjective) {
      this.addAnswer(APQ.secondaryInvestingObjective.id, APQ.secondaryInvestingObjective.answers[input.secondaryInvestingObjective]);
    }

    if (input.liquidNetWorth) {
      this.addAnswer(APQ.liquidNetWorth.id, APQ.liquidNetWorth.answers[input.liquidNetWorth]);
    }

    if (input.liquidityNeeds) {
      this.addAnswer(APQ.liquidityNeeds.id, APQ.liquidityNeeds.answers[input.liquidityNeeds]);
    }

    if (input.timeHorizon) {
      this.addAnswer(APQ.timeHorizon.id, APQ.timeHorizon.answers[input.timeHorizon]);
    }
  }

  public addServiceProfile(input: CreateApplicationInput) {
    this.addAnswer(APQ.enableSweepProgram.id, input.enableSweepProgram ? APQ.enableSweepProgram.answers.yes : APQ.enableSweepProgram.answers.no);

    if (!input.enableSweepProgram) {
      this.addAnswer(APQ.actionOnSecuritiesSold.id, APQ.actionOnSecuritiesSold.answers[input.actionOnSecuritiesSold]);
    }

    this.addAnswer(APQ.dividendReinvestment.id, input.dividendReinvestment ? APQ.dividendReinvestment.answers.yes : APQ.dividendReinvestment.answers.no);

    if (!input.dividendReinvestment && input.dividendProceeds) {
      this.addAnswer(APQ.dividendProceeds.id, APQ.dividendProceeds.answers[input.dividendProceeds]);
      if (input.dividendProceeds === EDividendProceedsAction.SEND && input.dividendProceedsSendFrequency) {
        this.addAnswer(APQ.dividendProceedsSendFrequency.id, APQ.dividendProceedsSendFrequency.answers[input.dividendProceedsSendFrequency]);
      }
    }
  }

  public addTransferOfDeath(input: CreateApplicationInput) {
    this.addAnswer(
      APQ.completeTransferOfDeath.id,
      input.completeTransferOfDeath ? APQ.completeTransferOfDeath.answers.yes : APQ.completeTransferOfDeath.answers.no,
    );

    if (input.completeTransferOfDeath && this.isTransferOfDeathFieldsValid(input)) {
      this.addAnswer(PRIMARY_BENEFICIARY_QUESTION_ID, PRIMARY_BENEFICIARY_YES_ANSWER);
      this.addAnswer(SECOND_BENEFICIARY_QUESTION_ID, SECOND_BENEFICIARY_NO_ANSWER);
      this.addAnswer(APQ.primaryBeneficiaryLegalName.id, input.primaryBeneficiaryLegalName);
      this.addAnswer(APQ.primaryBeneficiaryDateOfBirth.id, dayjs(input.primaryBeneficiaryDateOfBirth).format(APEX_FORM_DATE_FORMAT));
      this.addAnswer(APQ.primaryBeneficiarySsn.id, input.primaryBeneficiarySsn);
      this.addAnswer(APQ.primaryBeneficiarySharePercentage.id, input.primaryBeneficiarySharePercentage);
      this.addAnswer(APQ.primaryBeneficiaryMailingAddressLine1.id, input.primaryBeneficiaryMailingAddressLine1);
      this.addAnswer(APQ.primaryBeneficiaryMailingAddressCity.id, input.primaryBeneficiaryMailingAddressCity);
      this.addAnswer(APQ.primaryBeneficiaryMailingAddressState.id, input.primaryBeneficiaryMailingAddressState);
      this.addAnswer(APQ.primaryBeneficiaryMailingAddressZipCode.id, input.primaryBeneficiaryMailingAddressZipCode);

      if (input.married) {
        this.addAnswer(APQ.married.id, APQ.married.answers.yes);
        this.addAnswer(APQ.spouseSignatureAgreement.id, APQ.spouseSignatureAgreement.answers.yes);
        this.addAnswer(APQ.spouseSignature.id, input.spouseSignature);
      } else {
        this.addAnswer(APQ.married.id, APQ.married.answers.no);
      }

      if (input.primaryBeneficiaryMailingAddressCountry === ECountry.USA) {
        this.addAnswer(IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID, IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_YES_ANSWER);
      } else {
        this.addAnswer(IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID, IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_NO_ANSWER);
        this.addAnswer(APQ.primaryBeneficiaryMailingAddressCountry.id, input.primaryBeneficiaryMailingAddressCountry);
      }

      if (input.primaryBeneficiaryMailingAddressLine2 && input.primaryBeneficiaryMailingAddressLine2.length > 0) {
        this.addAnswer(APQ.primaryBeneficiaryMailingAddressLine2.id, input.primaryBeneficiaryMailingAddressLine2);
      }

      if (input.primaryBeneficiaryMailingAddressRegion && input.primaryBeneficiaryMailingAddressRegion.length > 0) {
        this.addAnswer(APQ.primaryBeneficiaryMailingAddressRegion.id, input.primaryBeneficiaryMailingAddressRegion);
      }
    }
  }

  public addLegalDisclosures(input: CreateApplicationInput) {
    if (input.completeTransferOfDeath) {
      if (input.transferOnDeathBeneficiaryDesignation) {
        this.addAnswer(APQ.transferOnDeathBeneficiaryDesignation.id, APQ.transferOnDeathBeneficiaryDesignation.answers.yes);
      } else {
        this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_AGREEMENT, 'transferOnDeathBeneficiaryDesignation');
      }
    }

    if (input.customerAccountAgreement) {
      this.addAnswer(APQ.customerAccountAgreement.id, APQ.customerAccountAgreement.answers.yes);
    } else {
      this.addValidationError(EAccountValidationErrorType.MISSING_CUSTOMER_AGREEMENT, 'customerAccountAgreement');
    }

    if (input.customerAccountAgreementCustodian) {
      this.addAnswer(APQ.customerAccountAgreementCustodian.id, APQ.customerAccountAgreementCustodian.answers.yes);
    } else {
      this.addValidationError(EAccountValidationErrorType.MISSING_CUSTOMER_CUSTODIAN_AGREEMENT, 'customerAccountAgreementCustodian');
    }
  }

  public addSignatures(input: CreateApplicationInput) {
    if (input.signaturePrimaryApplicant && input.signaturePrimaryApplicant.length > 0) {
      this.addAnswer(APQ.signaturePrimaryApplicant.id, input.signaturePrimaryApplicant);
    } else {
      this.addValidationError(EAccountValidationErrorType.MISSING_PRIMARY_APPLICANT_SIGNATURE, 'signaturePrimaryApplicant');
    }
  }

  private isTransferOfDeathFieldsValid(input: CreateApplicationInput): boolean {
    let isTransferOfDeathFieldsValid = true;
    if (input.married == null) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'married');
      isTransferOfDeathFieldsValid = false;
    }

    if (input.married && !input.spouseSignatureAgreement) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'spouseSignatureAgreement');
      isTransferOfDeathFieldsValid = false;
    }

    if (input.married && (!input.spouseSignature || input.spouseSignature.length === 0)) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'spouseSignature');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryLegalName || input.primaryBeneficiaryLegalName.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryLegalName');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryDateOfBirth) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryDateOfBirth');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiarySsn || input.primaryBeneficiarySsn.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiarySsn');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiarySharePercentage || input.primaryBeneficiarySharePercentage > 100 || input.primaryBeneficiarySharePercentage < 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiarySharePercentage');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryMailingAddressCountry || input.primaryBeneficiaryMailingAddressCountry.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryMailingAddressCountry');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryMailingAddressLine1 || input.primaryBeneficiaryMailingAddressLine1.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryMailingAddressLine1');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryMailingAddressCity || input.primaryBeneficiaryMailingAddressCity.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryMailingAddressCity');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryMailingAddressState || input.primaryBeneficiaryMailingAddressState.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryMailingAddressState');
      isTransferOfDeathFieldsValid = false;
    }

    if (!input.primaryBeneficiaryMailingAddressZipCode || input.primaryBeneficiaryMailingAddressZipCode.length === 0) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRANSFER_ON_DEATH_FIELDS, 'primaryBeneficiaryMailingAddressZipCode');
      isTransferOfDeathFieldsValid = false;
    }

    return isTransferOfDeathFieldsValid;
  }

  private isTrustedContactFieldsValid(input: CreateApplicationInput): boolean {
    let isTrustedContactFieldsValid = true;
    if (!input.trustedContactFirstName) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactFirstName');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactLastName) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactLastName');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactPhoneNumber) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactPhoneNumber');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactEmail) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactEmail');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactCountry) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactCountry');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactAddressLine1) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactAddressLine1');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactCity) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactCity');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactState) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactState');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactZipCode) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactZipCode');
      isTrustedContactFieldsValid = false;
    }
    if (!input.trustedContactDisclosureAgreement) {
      this.addValidationError(EAccountValidationErrorType.MISSING_TRUSTED_CONTACT_FIELDS, 'trustedContactDisclosureAgreement');
      isTrustedContactFieldsValid = false;
    }
    return isTrustedContactFieldsValid;
  }

  private isMailingAddressFieldsValid(input: CreateApplicationInput): boolean {
    let isMailingAddressValid = true;
    if (!input.mailingAddressCountry) {
      this.addValidationError(EAccountValidationErrorType.MISSING_MAILING_ADDRESS_FIELDS, 'mailingAddressCountry');
    }
    if (!input.mailingAddressCity) {
      this.addValidationError(EAccountValidationErrorType.MISSING_MAILING_ADDRESS_FIELDS, 'mailingAddressCity');
      isMailingAddressValid = false;
    }
    if (!input.mailingAddressLine1) {
      this.addValidationError(EAccountValidationErrorType.MISSING_MAILING_ADDRESS_FIELDS, 'mailingAddressLine1');
      isMailingAddressValid = false;
    }
    if (!input.mailingAddressState) {
      this.addValidationError(EAccountValidationErrorType.MISSING_MAILING_ADDRESS_FIELDS, 'mailingAddressState');
      isMailingAddressValid = false;
    }
    if (!input.mailingAddressZipCode) {
      this.addValidationError(EAccountValidationErrorType.MISSING_MAILING_ADDRESS_FIELDS, 'mailingAddressZipCode');
      isMailingAddressValid = false;
    }
    return isMailingAddressValid;
  }

  private validateDateOfBirth(dateOfBirth: Date) {
    this.customerAge = dayjs().diff(dayjs(dateOfBirth), 'year');
    if (this.customerAge < 0 || this.customerAge > 100) {
      this.addValidationError(EAccountValidationErrorType.INVALID_DATE_OF_BIRTH, 'dateOfBirth');
    }
  }

  private addValidationError(reason: EAccountValidationErrorType, fieldName: keyof CreateApplicationInput) {
    this.validationErrors.push({
      message: getErrorMessage(reason, fieldName),
      reason,
      fieldName,
    });
  }

  private addUnsupportedAccountTypeError(reason: EUnsupportedAccountErrorReason, fieldName: keyof CreateApplicationInput) {
    this.unsupportedAccountErrors.push({
      message: getErrorMessage(reason, fieldName),
      reason,
      fieldName,
    });
  }

  private addAnswer(questionId: number, answer: string | number) {
    this.form.push({
      question_id: questionId,
      data: answer,
    });
  }
}
