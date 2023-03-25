/* eslint-disable camelcase */
import dayjs from 'dayjs';
import { expect } from '@jest/globals';
import { gCall } from '../test-utils/gcall';
import { launchpadUserMetadata } from '../test-utils/common';
import connection from '../test-utils/connection';
import { EUnsupportedAccountErrorReason as EUnsupAER } from '../enums/onboarding/unsupported-account-error-reason';
import { EAccountValidationErrorType as EAccVET } from '../enums/onboarding/account-validation-error-type';
import { AccountInputValidationErrorMessage, UnsupportedAccountParameter } from '../results/create-application';
import { OnboardingApplication } from '../apex-extend/onboarding/onboarding-application';
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
  US_CITIZEN_YES_ANSWER
} from '../apex-extend/onboarding/application-questions-info';
import { CreateApplicationInput } from '../inputs/create-application';
import { ECountry } from '../enums/country';
import { EAccountLocationType } from '../enums/onboarding/account-location-type';
import { EEmploymentStatus } from '../enums/onboarding/employment-status';
import { createTradingAccount, deleteTradingAccounts } from '../test-utils/trading-account';
import nock from 'nock';
import path from 'path';
import axios from 'axios';

/* eslint-disable @typescript-eslint/no-var-requires */
const VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS = require('./data/apex-valid-payload-without-tod-and-only-residential-address.json');
const VALID_PAYLOAD_WITH_TRUSTED_CONTACT = require('./data/apex-valid-payload-trusted-contact-without-tod-only-residential-address.json');
const VALID_PAYLOAD_WITH_TOD_AND_TRUSTED_CONTACT = require('./data/apex-valid-payload-trusted-contact-without-tod-only-residential-address.json');
const VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS = require('./data/apex-valid-payload-tod-trusted-contact-mailing-address.json');
const INVALID_PAYLOAD_MISSING_FIELDS_FOR_MAILING_ADDRESS_AND_TRUSTED_CONTACT
  = require('./data/apex-invalid-payload-missing-fields-for-mailing-address-and-trusted-contact.json');
const INVALID_PAYLOAD_NON_US_ACCOUNT = require('./data/apex-invalid-payload-non-us-account.json');
const INVALID_PAYLOAD_MISSING_TOD_FIELDS = require('./data/apex-invalid-payload-missing-tod-fields.json');
const INVALID_PAYLOAD_MISSING_SIGNATURES_AGREEMENTS_WRONG_DOB
  = require('./data/apex-invalid-payload-missing-signatures-and-agreements-wrong-date-of-birth.json');
const INVALID_PAYLOAD_UNSUPPORTED_ACCOUNTS = require('./data/apex-invalid-payload-unsupported-accounts.json');
/* eslint-enable @typescript-eslint/no-var-requires */

const APEX_EXTEND_TESTS_TIMEOUT_MILLIS = 30_000;
const APEX_FORM_DATE_FORMAT = 'MM/DD/YYYY';

const APEX_AUTH_PATH = '/api/auth/login';

const createApplicationMutation = `
mutation Mutation($data: CreateApplicationInput!) {
  createApplication(data: $data) {
    ... on CreateApplicationSuccess {
      applicationId
      requestId
    }
    ... on UnsupportedAccountTypeError {
      unsupportedAccountTypeErrors: errors {
        message
        reason
        fieldName
      }
    }
    ... on AccountInputValidationError {
      accountInputValidationErrors: errors {
        message
        reason
        fieldName
      }
    }
    ... on TradeAccountAlreadyExistsError {
      message
      requestId
    }
    ... on InternalProcessingError {
      message
    }
  }
}
`;

const getApplicationStatusQuery = (applicationId: string) => `
  query Query {
      getApplicationStatus(applicationId: ${applicationId}) {
          status
          tradeAccountId
          requestId
          validationErrors{
              fieldName
              errors
          }
      }
  }
`;

const removeTradeAccount = async () => {
  const response = await gCall({
    source: `
    mutation Mutation($accountType: EAccountType!) {
      removeTradeAccount(accountType: $accountType) {
        ... on RemoveTradeAccountSuccess {
          message
        }
        ... on ApplicationNotFoundResult {
          message
          requestId
        }
      }
    }
  `,
    variableValues: {
      accountType: 'CASH'
    },
    contextValue: {
      metadata: launchpadUserMetadata

    }
  });
  return response.data.removeTradeAccount;
};

axios.defaults.adapter = require('axios/lib/adapters/http');

nock.back.fixtures = path.join('./', 'src', '__tests__', '__nock-fixtures__');
nock.back.setMode('record');
nock.enableNetConnect();

const copyInput = (input: any) => JSON.parse(JSON.stringify(input));

const prepareFixtureAfterRecord = (records: any[]) => {
  for (const record of records) {
    if (record.path === APEX_AUTH_PATH) {
      record.body.api_key = 'api_key';
      record.body.api_secret = 'api_secret';
      record.response.login.token.access_token = 'access_token';
      record.response.login.user.id = 'user_id';
      record.response.login.user.email = 'user_email';
    }
  }
  return records;
};

const prepareFixtureBeforeUsage = (scope: any) => {
  if (scope.path.startsWith(APEX_AUTH_PATH)) {
    scope.response.login.token.access_token = 'access_token';
    scope.response.login.user.id = 'user_id';
    scope.response.login.user.email = 'user_email';
    scope.filteringRequestBody = (body: any, aRecordedBody: any) => {
      const parsedBody = JSON.parse(body);
      parsedBody.api_key = 'api_key';
      parsedBody.api_secret = 'api_secret';
      return JSON.stringify(parsedBody);
    }
  }
}

const nockBackOptions = { before: prepareFixtureBeforeUsage, afterRecord: prepareFixtureAfterRecord };

describe('Onboarding applications: ', () => {

  describe('With requests to APEX Extend: ', () => {
    const userId = launchpadUserMetadata.user.id;
    const expectedTradeAccountId = process.env.APEX_EXTEND_TRADE_ACCOUNT_ID.split(',')[0];
    let envVars: any;
    beforeAll(async () => {
      await connection.create();
      nock.enableNetConnect();
    }, connection.creationTimeoutMs);
    afterAll(async () => {
      await connection.close();
    });
    beforeEach(() => {
      envVars = { ...process.env };
      jest.clearAllMocks();
      nock.enableNetConnect();
    });
    afterEach(() => {
      process.env = { ...envVars };
      nock.restore();
      nock.enableNetConnect();
    })

    describe('', () => {
      afterAll(async () => {
        await deleteTradingAccounts();
      });

      it('Returns error if no trading accounts available', async () => {
        expect.assertions(2);
        try {
          process.env.APEX_EXTEND_TRADE_ACCOUNT_ID = '123';
          await createTradingAccount(2, '123');
          await gCall({
            source: createApplicationMutation,
            variableValues: {
              data: VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS
            },
            contextValue: {
              metadata: launchpadUserMetadata
            }
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.toString().includes('A pool of precreated UAT trading accounts is empty')).toBeTruthy();
        }
      });
    });

    it('Should return error if account already exists', async () => {
      await createTradingAccount(userId, 'test');
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(response.data.createApplication.message).toEqual('Current user already has trading account');
      expect(response.data.createApplication.requestId).toEqual(expect.any(String));
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Successfully deleted');
    });

    it('removeTradeAccount returns correct message if there is nothing to delete', async () => {
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    });

    it('Should successfully validate application without TOD and create entity in db', async () => {
      const { nockDone } = await nock.back('onboarding_valid_payload_without_tod_and_only_residential_address.json', nockBackOptions);

      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const applicationId = response.data.createApplication.applicationId;
      const applicationStatus = await gCall({
        source: getApplicationStatusQuery(applicationId),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(applicationStatus.data.getApplicationStatus.status).toEqual('COMPLETED');
      expect(applicationStatus.data.getApplicationStatus.tradeAccountId).toEqual(expectedTradeAccountId);
      expect(applicationStatus.data.getApplicationStatus.validationErrors).toBeNull();
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Successfully deleted');
      nockDone();

    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should successfully validate application with trusted contact info and create entity in db', async () => {
      const { nockDone } = await nock.back('onboarding_valid_payload_with_trusted_contact.json', nockBackOptions);
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: VALID_PAYLOAD_WITH_TRUSTED_CONTACT
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const applicationId = response.data.createApplication.applicationId;
      const applicationStatus = await gCall({
        source: getApplicationStatusQuery(applicationId),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(applicationStatus.data.getApplicationStatus.status).toEqual('COMPLETED');
      expect(applicationStatus.data.getApplicationStatus.tradeAccountId).toEqual(expectedTradeAccountId);
      expect(applicationStatus.data.getApplicationStatus.validationErrors).toBeNull();
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Successfully deleted');

      nockDone();
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should successfully validate application with TOD and trusted contact and create entity in db', async () => {
      const { nockDone } = await nock.back('onboarding_valid_payload_with_tod_and_trusted_contact.json', nockBackOptions);
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: VALID_PAYLOAD_WITH_TOD_AND_TRUSTED_CONTACT
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const applicationId = response.data.createApplication.applicationId;
      const applicationStatus = await gCall({
        source: getApplicationStatusQuery(applicationId),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(applicationStatus.data.getApplicationStatus.status).toEqual('COMPLETED');
      expect(applicationStatus.data.getApplicationStatus.tradeAccountId).toEqual(expectedTradeAccountId);
      expect(applicationStatus.data.getApplicationStatus.validationErrors).toBeNull();
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Successfully deleted');
      nockDone();
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should successfully validate application with TOD, trusted contact and mailing address and create entity in db', async () => {
      const { nockDone } = await nock.back('onboarding_valid_payload_with_tod_and_trusted_contact_mailing_address.json', nockBackOptions);
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const applicationId = response.data.createApplication.applicationId;
      const applicationStatus = await gCall({
        source: getApplicationStatusQuery(applicationId),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(applicationStatus.data.getApplicationStatus.status).toEqual('COMPLETED');
      expect(applicationStatus.data.getApplicationStatus.tradeAccountId).toEqual(expectedTradeAccountId);
      expect(applicationStatus.data.getApplicationStatus.validationErrors).toBeNull();
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Successfully deleted');
      nockDone();
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should return accountInputValidationErrors on missing fields in mailing address and trusted contact', async () => {
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: INVALID_PAYLOAD_MISSING_FIELDS_FOR_MAILING_ADDRESS_AND_TRUSTED_CONTACT
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });

      const accountInputValidationErrors: AccountInputValidationErrorMessage[] = response.data.createApplication.accountInputValidationErrors;
      expect(accountInputValidationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS, fieldName: 'mailingAddressCountry', message: expect.any(String) },
        { reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS, fieldName: 'mailingAddressLine1', message: expect.any(String) },
        { reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS, fieldName: 'mailingAddressCity', message: expect.any(String) },
        { reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS, fieldName: 'mailingAddressState', message: expect.any(String) },
        { reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS, fieldName: 'mailingAddressZipCode', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactFirstName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactLastName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactPhoneNumber', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactEmail', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactCountry', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactAddressLine1', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactCity', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactState', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactZipCode', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactDisclosureAgreement', message: expect.any(String) },
      ]));
      expect(accountInputValidationErrors.length).toEqual(15);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should return accountInputValidationErrors on missing fields in transfer of death', async () => {
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: INVALID_PAYLOAD_MISSING_TOD_FIELDS
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const accountInputValidationErrors: AccountInputValidationErrorMessage[] = response.data.createApplication.accountInputValidationErrors;
      expect(accountInputValidationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'married', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryLegalName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryDateOfBirth', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiarySsn', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiarySharePercentage', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressCountry', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressLine1', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressCity', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressState', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressZipCode', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_AGREEMENT, fieldName: 'transferOnDeathBeneficiaryDesignation', message: expect.any(String) },
      ]));
      expect(accountInputValidationErrors.length).toEqual(11);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should return accountInputValidationErrors on missing signatures and agreements and date of birth more than 100 years ago', async () => {
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: INVALID_PAYLOAD_MISSING_SIGNATURES_AGREEMENTS_WRONG_DOB
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const accountInputValidationErrors: AccountInputValidationErrorMessage[] = response.data.createApplication.accountInputValidationErrors;
      expect(accountInputValidationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.INVALID_DATE_OF_BIRTH, fieldName: 'dateOfBirth', message: expect.any(String) },
        { reason: EAccVET.MISSING_PRIMARY_APPLICANT_SIGNATURE, fieldName: 'signaturePrimaryApplicant', message: expect.any(String) },
        { reason: EAccVET.MISSING_CUSTOMER_AGREEMENT, fieldName: 'customerAccountAgreement', message: expect.any(String) },
        { reason: EAccVET.MISSING_CUSTOMER_CUSTODIAN_AGREEMENT, fieldName: 'customerAccountAgreementCustodian', message: expect.any(String) },
        { reason: EAccVET.TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER, fieldName: 'doYouWantToAddTrustedContactInformation', message: expect.any(String) },
      ]));
      expect(accountInputValidationErrors.length).toEqual(5);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should return unsupportedAccountTypeErrors for non-US account', async () => {
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: INVALID_PAYLOAD_NON_US_ACCOUNT
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const unsupportedAccountTypeErrors: UnsupportedAccountParameter[] = response.data.createApplication.unsupportedAccountTypeErrors;
      expect(unsupportedAccountTypeErrors).toEqual([
        { reason: EUnsupAER.NON_US_CITIZEN, fieldName: 'citizenshipCountry', message: expect.any(String) },
      ]);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should return unsupportedAccountTypeErrors', async () => {
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: INVALID_PAYLOAD_UNSUPPORTED_ACCOUNTS
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const unsupportedAccountTypeErrors: UnsupportedAccountParameter[] = response.data.createApplication.unsupportedAccountTypeErrors;
      expect(unsupportedAccountTypeErrors).toEqual(expect.arrayContaining([
        { reason: EUnsupAER.NON_US_CITIZEN, fieldName: 'citizenshipCountry', message: expect.any(String) },
        { reason: EUnsupAER.NON_DOMESTIC_ACCOUNT, fieldName: 'accountLocationType', message: expect.any(String) },
        { reason: EUnsupAER.POLITICAL_OR_PUBLIC_PERSON, fieldName: 'isAccountMaintainedForPoliticalOrPublicPerson', message: expect.any(String) },
        { reason: EUnsupAER.PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER, fieldName: 'isAccountHolderIsControlHolderOfPublicCompany', message: expect.any(String) },
        { reason: EUnsupAER.AFFILIATED_WITH_EXCHANGE_OR_FINRA, fieldName: 'isAffiliatedWithExchangeOrFINRA', message: expect.any(String) },
      ]));
      expect(unsupportedAccountTypeErrors.length).toEqual(5);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);

    it('Should handle error message from apex for invalid phone number and SSN', async () => {
      const { nockDone } = await nock.back('onboarding_valid_payload_with_tod_validation_errors.json', nockBackOptions);
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS);
      input.phoneNumber = '+199999';
      input.ssn = '6710';
      const response = await gCall({
        source: createApplicationMutation,
        variableValues: {
          data: input
        },
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      const applicationId = response.data.createApplication.applicationId;
      const applicationStatus = await gCall({
        source: getApplicationStatusQuery(applicationId),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });

      expect(applicationStatus.data.getApplicationStatus.status).toEqual('APPLICATION_VALIDATION_FAILED');
      expect(applicationStatus.data.getApplicationStatus.validationErrors).toEqual(expect.arrayContaining([
        { fieldName: 'ssn', errors: ['The data must be 9 digits.'] },
        { fieldName: 'phoneNumber', errors: ['Phone number is invalid.'] }
      ]));
      expect(applicationStatus.data.getApplicationStatus.validationErrors.length).toEqual(2);
      const deleteMessage = await removeTradeAccount();
      expect(deleteMessage.message).toEqual('Application not found');
      expect(deleteMessage.requestId).toEqual(expect.any(String));
      nockDone();
    }, APEX_EXTEND_TESTS_TIMEOUT_MILLIS);
  });

  describe('Unit tests for OnboardingApplication class', () => {
    let onboardingApplication: OnboardingApplication;
    beforeEach(() => {
      onboardingApplication = new OnboardingApplication();
    });

    const checkIfApplicationHasNoErrors = () => {
      const {
        unsupportedAccountErrors,
        validationErrors
      } = onboardingApplication.getErrors();
      expect(unsupportedAccountErrors.length).toEqual(0);
      expect(validationErrors.length).toEqual(0);
    };

    it('correct behavior in addDefaults', () => {
      onboardingApplication.addDefaults();
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: INDIVIDUAL_CUSTOMER_TYPE_QUESTION_ID, data: INDIVIDUAL_CUSTOMER_TYPE_ANSWER },
        { question_id: CASH_ACCOUNT_TYPE_QUESTION_ID, data: CASH_ACCOUNT_TYPE_ANSWER },
        { question_id: OPTIONS_TRADING_QUESTION_ID, data: OPTIONS_TRADING_ANSWER }
      ]));
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addIdentitySection with valid payload', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      input.middleName = 'R. ';
      onboardingApplication.addIdentitySection(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.firstName.id, data: input.firstName },
        { question_id: APQ.lastName.id, data: input.lastName },
        { question_id: APQ.dateOfBirth.id, data: dayjs(input.dateOfBirth).format(APEX_FORM_DATE_FORMAT) },
        { question_id: APQ.phoneNumber.id, data: input.phoneNumber },
        { question_id: APQ.email.id, data: input.email },
        { question_id: APQ.middleName.id, data: input.middleName },
      ]));
      checkIfApplicationHasNoErrors();
    });

    it('adds validationError in addIdentitySection on incorrect date of birth', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      input.dateOfBirth = new Date('1800-10-10');
      onboardingApplication.addIdentitySection(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual([expect.objectContaining({
        reason: EAccVET.INVALID_DATE_OF_BIRTH,
        fieldName: 'dateOfBirth',
        message: expect.any(String)
      })]);
    });

    it('correct behavior in addCitizenshipWithSsn with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      onboardingApplication.addCitizenshipWithSsn(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: US_CITIZEN_QUESTION_ID, data: US_CITIZEN_YES_ANSWER },
        { question_id: APQ.ssn.id, data: input.ssn }
      ]));
      checkIfApplicationHasNoErrors();
    });

    it('returns unsupported account error in addCitizenshipWithSsn', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      input.citizenshipCountry = ECountry.AUS;
      onboardingApplication.addCitizenshipWithSsn(input);
      const { unsupportedAccountErrors } = onboardingApplication.getErrors();
      expect(unsupportedAccountErrors).toEqual(expect.arrayContaining([
        { reason: EUnsupAER.NON_US_CITIZEN, fieldName: 'citizenshipCountry', message: expect.any(String) },
      ]));
    });

    it('correct behavior in addHomeAddress with non-us residential address', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.residentialAddressCountry = ECountry.MEX;
      input.residentialAddressCity = 'Guadalajara';
      input.residentialAddressLine1 = 'Chicago 120, Ferrocarril';
      input.residentialAddressState = 'Jal.';
      input.residentialAddressZipCode = '44440';
      onboardingApplication.addHomeAddress(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: IS_CURRENT_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_ADDRESS_US_NO_ANSWER },
        { question_id: APQ.residentialAddressCountry.id, data: input.residentialAddressCountry },
        { question_id: APQ.residentialAddressLine1.id, data: input.residentialAddressLine1 },
        { question_id: APQ.residentialAddressCity.id, data: input.residentialAddressCity },
        { question_id: APQ.residentialAddressState.id, data: input.residentialAddressState },
        { question_id: APQ.residentialAddressZipCode.id, data: input.residentialAddressZipCode },
        { question_id: APQ.isMailingAddressSameAsResidentialAddress.id, data: APQ.isMailingAddressSameAsResidentialAddress.answers.yes },
      ]));
      expect(answers.length).toEqual(7);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addHomeAddress with valid input without mailing address', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.residentialAddressLine2 = '2/2';
      input.residentialAddressRegion = 'California';
      onboardingApplication.addHomeAddress(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: IS_CURRENT_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_ADDRESS_US_YES_ANSWER },
        { question_id: APQ.residentialAddressLine1.id, data: input.residentialAddressLine1 },
        { question_id: APQ.residentialAddressCity.id, data: input.residentialAddressCity },
        { question_id: APQ.residentialAddressState.id, data: input.residentialAddressState },
        { question_id: APQ.residentialAddressZipCode.id, data: input.residentialAddressZipCode },
        { question_id: APQ.residentialAddressLine2.id, data: input.residentialAddressLine2 },
        { question_id: APQ.residentialAddressRegion.id, data: input.residentialAddressRegion },
        { question_id: APQ.isMailingAddressSameAsResidentialAddress.id, data: APQ.isMailingAddressSameAsResidentialAddress.answers.yes },
      ]));
      expect(answers.length).toEqual(8);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addHomeAddress with valid input with mailing address', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.residentialAddressLine2 = '2/2';
      input.residentialAddressRegion = 'California';
      input.mailingAddressLine2 = '2/2';
      input.mailingAddressRegion = 'California';
      onboardingApplication.addHomeAddress(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: IS_CURRENT_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_ADDRESS_US_YES_ANSWER },
        { question_id: APQ.residentialAddressLine1.id, data: input.residentialAddressLine1 },
        { question_id: APQ.residentialAddressCity.id, data: input.residentialAddressCity },
        { question_id: APQ.residentialAddressState.id, data: input.residentialAddressState },
        { question_id: APQ.residentialAddressZipCode.id, data: input.residentialAddressZipCode },
        { question_id: APQ.residentialAddressLine2.id, data: input.residentialAddressLine2 },
        { question_id: APQ.residentialAddressRegion.id, data: input.residentialAddressRegion },
        { question_id: APQ.isMailingAddressSameAsResidentialAddress.id, data: APQ.isMailingAddressSameAsResidentialAddress.answers.no },
        { question_id: IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_MAILING_ADDRESS_US_YES_ANSWER },
        { question_id: APQ.mailingAddressLine1.id, data: input.mailingAddressLine1 },
        { question_id: APQ.mailingAddressCity.id, data: input.mailingAddressCity },
        { question_id: APQ.mailingAddressState.id, data: input.mailingAddressState },
        { question_id: APQ.mailingAddressZipCode.id, data: input.mailingAddressZipCode },
        { question_id: APQ.mailingAddressLine2.id, data: input.mailingAddressLine2 },
        { question_id: APQ.mailingAddressRegion.id, data: input.mailingAddressRegion },
      ]));
      expect(answers.length).toEqual(15);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addHomeAddress with valid input with non-US mailing address', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.mailingAddressCountry = ECountry.MEX;
      input.mailingAddressCity = 'Guadalajara';
      input.mailingAddressLine1 = 'Chicago 120, Ferrocarril';
      input.mailingAddressState = 'Jal.';
      input.mailingAddressZipCode = '44440';
      onboardingApplication.addHomeAddress(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: IS_CURRENT_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_ADDRESS_US_YES_ANSWER },
        { question_id: APQ.residentialAddressLine1.id, data: input.residentialAddressLine1 },
        { question_id: APQ.residentialAddressCity.id, data: input.residentialAddressCity },
        { question_id: APQ.residentialAddressState.id, data: input.residentialAddressState },
        { question_id: APQ.residentialAddressZipCode.id, data: input.residentialAddressZipCode },
        { question_id: APQ.isMailingAddressSameAsResidentialAddress.id, data: APQ.isMailingAddressSameAsResidentialAddress.answers.no },
        { question_id: IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID, data: IS_CURRENT_MAILING_ADDRESS_US_NO_ANSWER },
        { question_id: APQ.mailingAddressCountry.id, data: input.mailingAddressCountry },
        { question_id: APQ.mailingAddressLine1.id, data: input.mailingAddressLine1 },
        { question_id: APQ.mailingAddressCity.id, data: input.mailingAddressCity },
        { question_id: APQ.mailingAddressState.id, data: input.mailingAddressState },
        { question_id: APQ.mailingAddressZipCode.id, data: input.mailingAddressZipCode },
      ]));
      expect(answers.length).toEqual(12);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addHomeAddress with missing mailing address fields', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.isMailingAddressSameAsResidentialAddress = false;
      delete input.mailingAddressCountry;
      delete input.mailingAddressCity;
      delete input.mailingAddressLine1;
      delete input.mailingAddressState;
      delete input.mailingAddressZipCode;
      onboardingApplication.addHomeAddress(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { fieldName: 'mailingAddressCountry', message: expect.any(String), reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS },
        { fieldName: 'mailingAddressLine1', message: expect.any(String), reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS },
        { fieldName: 'mailingAddressCity', message: expect.any(String), reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS },
        { fieldName: 'mailingAddressState', message: expect.any(String), reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS },
        { fieldName: 'mailingAddressZipCode', message: expect.any(String), reason: EAccVET.MISSING_MAILING_ADDRESS_FIELDS },
      ]));
      expect(validationErrors.length).toEqual(5);
    });

    it('correct behavior in addDisclosures with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      onboardingApplication.addDisclosures(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.isAccountMaintainedForPoliticalOrPublicPerson.id, data: APQ.isAccountMaintainedForPoliticalOrPublicPerson.answers.no },
        { question_id: APQ.isAccountHolderIsControlHolderOfPublicCompany.id, data: APQ.isAccountHolderIsControlHolderOfPublicCompany.answers.no },
        { question_id: APQ.isAffiliatedWithExchangeOrFINRA.id, data: APQ.isAffiliatedWithExchangeOrFINRA.answers.no },
        { question_id: APQ.isThirdPartyTradingAuthorizationGranted.id, data: APQ.isThirdPartyTradingAuthorizationGranted.answers.no },
      ]));
      expect(answers.length).toEqual(4);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addDisclosures with valid input with 3rd party agent', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.isThirdPartyTradingAuthorizationGranted = true;
      input.nameOfThirdPartyAgent = 'Interactive Brokers';
      onboardingApplication.addDisclosures(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.isAccountMaintainedForPoliticalOrPublicPerson.id, data: APQ.isAccountMaintainedForPoliticalOrPublicPerson.answers.no },
        { question_id: APQ.isAccountHolderIsControlHolderOfPublicCompany.id, data: APQ.isAccountHolderIsControlHolderOfPublicCompany.answers.no },
        { question_id: APQ.isAffiliatedWithExchangeOrFINRA.id, data: APQ.isAffiliatedWithExchangeOrFINRA.answers.no },
        { question_id: APQ.isThirdPartyTradingAuthorizationGranted.id, data: APQ.isThirdPartyTradingAuthorizationGranted.answers.yes },
        { question_id: APQ.nameOfThirdPartyAgent.id, data: input.nameOfThirdPartyAgent },
      ]));
      expect(answers.length).toEqual(5);
      checkIfApplicationHasNoErrors();
    });

    it('returns validation error if 3rd party agent name is not provided', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.isThirdPartyTradingAuthorizationGranted = true;
      onboardingApplication.addDisclosures(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { fieldName: 'nameOfThirdPartyAgent', message: expect.any(String), reason: EAccVET.MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT },
      ]));
      expect(validationErrors.length).toEqual(1);
    });

    it('returns unsupported account error in addDisclosures', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.isAccountMaintainedForPoliticalOrPublicPerson = true;
      input.isAccountHolderIsControlHolderOfPublicCompany = true;
      input.isAffiliatedWithExchangeOrFINRA = true;
      onboardingApplication.addDisclosures(input);
      const { unsupportedAccountErrors } = onboardingApplication.getErrors();
      expect(unsupportedAccountErrors).toEqual(expect.arrayContaining([
        { reason: EUnsupAER.POLITICAL_OR_PUBLIC_PERSON, fieldName: 'isAccountMaintainedForPoliticalOrPublicPerson', message: expect.any(String) },
        { reason: EUnsupAER.PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER, fieldName: 'isAccountHolderIsControlHolderOfPublicCompany', message: expect.any(String) },
        { reason: EUnsupAER.AFFILIATED_WITH_EXCHANGE_OR_FINRA, fieldName: 'isAffiliatedWithExchangeOrFINRA', message: expect.any(String) },]));
      expect(unsupportedAccountErrors.length).toEqual(3);
    });

    it('correct behavior in addAccountLocation with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      onboardingApplication.addAccountLocation(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.accountLocationType.id, data: APQ.accountLocationType.answers.domestic },
      ]));
      expect(answers.length).toEqual(1);
      checkIfApplicationHasNoErrors();
    });

    it('returns unsupported account error in addAccountLocation for foreign accounts', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.accountLocationType = EAccountLocationType.FOREIGN;
      onboardingApplication.addAccountLocation(input);
      const { unsupportedAccountErrors } = onboardingApplication.getErrors();
      expect(unsupportedAccountErrors).toEqual(expect.arrayContaining([
        { reason: EUnsupAER.NON_DOMESTIC_ACCOUNT, fieldName: 'accountLocationType', message: expect.any(String) },
      ]));
      expect(unsupportedAccountErrors.length).toEqual(1);
    });

    it('correct behavior in addTrustedContact with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      onboardingApplication.addTrustedContact(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.areYou55OrOlder.id, data: APQ.areYou55OrOlder.answers.no },
        { question_id: APQ.doYouWantToAddTrustedContactInformation.id, data: APQ.doYouWantToAddTrustedContactInformation.answers.yes },
        { question_id: APQ.trustedContactFirstName.id, data: input.trustedContactFirstName },
        { question_id: APQ.trustedContactLastName.id, data: input.trustedContactLastName },
        { question_id: APQ.trustedContactPhoneNumber.id, data: input.trustedContactPhoneNumber },
        { question_id: APQ.trustedContactEmail.id, data: input.trustedContactEmail },
        { question_id: IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID, data: IS_TRUSTED_CONTACT_LOCATED_IN_US_YES_ANSWER },
        { question_id: APQ.trustedContactAddressLine1.id, data: input.trustedContactAddressLine1 },
        { question_id: APQ.trustedContactAddressLine2.id, data: input.trustedContactAddressLine2 },
        { question_id: APQ.trustedContactCity.id, data: input.trustedContactCity },
        { question_id: APQ.trustedContactState.id, data: input.trustedContactState },
        { question_id: APQ.trustedContactRegion.id, data: input.trustedContactRegion },
        { question_id: APQ.trustedContactZipCode.id, data: input.trustedContactZipCode },
        { question_id: APQ.trustedContactDisclosureAgreement.id, data: APQ.trustedContactDisclosureAgreement.answers.yes },
      ]));
      expect(answers.length).toEqual(14);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTrustedContact with valid input for aged customer', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.areYou55OrOlder = true;
      onboardingApplication.addTrustedContact(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.areYou55OrOlder.id, data: APQ.areYou55OrOlder.answers.yes },
        { question_id: APQ.doYouWantToAddTrustedContactInformation.id, data: APQ.doYouWantToAddTrustedContactInformation.answers.yes },
        { question_id: APQ.trustedContactFirstName.id, data: input.trustedContactFirstName },
        { question_id: APQ.trustedContactLastName.id, data: input.trustedContactLastName },
        { question_id: APQ.trustedContactPhoneNumber.id, data: input.trustedContactPhoneNumber },
        { question_id: APQ.trustedContactEmail.id, data: input.trustedContactEmail },
        { question_id: IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID, data: IS_TRUSTED_CONTACT_LOCATED_IN_US_YES_ANSWER },
        { question_id: APQ.trustedContactAddressLine1.id, data: input.trustedContactAddressLine1 },
        { question_id: APQ.trustedContactAddressLine2.id, data: input.trustedContactAddressLine2 },
        { question_id: APQ.trustedContactCity.id, data: input.trustedContactCity },
        { question_id: APQ.trustedContactState.id, data: input.trustedContactState },
        { question_id: APQ.trustedContactRegion.id, data: input.trustedContactRegion },
        { question_id: APQ.trustedContactZipCode.id, data: input.trustedContactZipCode },
        { question_id: APQ.trustedContactDisclosureAgreement.id, data: APQ.trustedContactDisclosureAgreement.answers.yes },
      ]));
      expect(answers.length).toEqual(14);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTrustedContact with non-US valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.trustedContactCountry = ECountry.MEX;
      input.trustedContactCity = 'Guadalajara';
      input.trustedContactAddressLine1 = 'Chicago 120, Ferrocarril';
      input.trustedContactAddressLine1 = 'j2';
      input.trustedContactState = 'Jal.';
      input.trustedContactZipCode = '44440';
      onboardingApplication.addTrustedContact(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.areYou55OrOlder.id, data: APQ.areYou55OrOlder.answers.no },
        { question_id: APQ.doYouWantToAddTrustedContactInformation.id, data: APQ.doYouWantToAddTrustedContactInformation.answers.yes },
        { question_id: APQ.trustedContactFirstName.id, data: input.trustedContactFirstName },
        { question_id: APQ.trustedContactLastName.id, data: input.trustedContactLastName },
        { question_id: APQ.trustedContactPhoneNumber.id, data: input.trustedContactPhoneNumber },
        { question_id: APQ.trustedContactEmail.id, data: input.trustedContactEmail },
        { question_id: IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID, data: IS_TRUSTED_CONTACT_LOCATED_IN_US_NO_ANSWER },
        { question_id: APQ.trustedContactCountry.id, data: input.trustedContactCountry },
        { question_id: APQ.trustedContactAddressLine1.id, data: input.trustedContactAddressLine1 },
        { question_id: APQ.trustedContactAddressLine2.id, data: input.trustedContactAddressLine2 },
        { question_id: APQ.trustedContactCity.id, data: input.trustedContactCity },
        { question_id: APQ.trustedContactState.id, data: input.trustedContactState },
        { question_id: APQ.trustedContactZipCode.id, data: input.trustedContactZipCode },
        { question_id: APQ.trustedContactDisclosureAgreement.id, data: APQ.trustedContactDisclosureAgreement.answers.yes },
      ]));
      expect(answers.length).toEqual(15);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTrustedContact without trusted contact info', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.doYouWantToAddTrustedContactInformation = false;
      onboardingApplication.addTrustedContact(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.areYou55OrOlder.id, data: APQ.areYou55OrOlder.answers.no },
        { question_id: APQ.doYouWantToAddTrustedContactInformation.id, data: APQ.doYouWantToAddTrustedContactInformation.answers.no },
      ]));
      expect(answers.length).toEqual(2);
      checkIfApplicationHasNoErrors();
    });

    it('returns validation error if trusted contact is not provided for person older that 55', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.dateOfBirth = new Date('1950-01-01');
      input.doYouWantToAddTrustedContactInformation = false;
      onboardingApplication.addIdentitySection(input);
      onboardingApplication.addTrustedContact(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER, fieldName: 'doYouWantToAddTrustedContactInformation', message: expect.any(String) }
      ]));
    });

    it('returns validation error if trusted contact fields are not provided for person older that 55', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.dateOfBirth = new Date('1950-01-01');
      input.doYouWantToAddTrustedContactInformation = true;
      onboardingApplication.addTrustedContact(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactFirstName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactLastName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactPhoneNumber', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactEmail', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactCountry', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactAddressLine1', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactCity', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactState', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactZipCode', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRUSTED_CONTACT_FIELDS, fieldName: 'trustedContactDisclosureAgreement', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(10);
    });

    it('correct behavior in addEmployment with employer info', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      onboardingApplication.addEmployment(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.employmentStatus.id, data: APQ.employmentStatus.answers[input.employmentStatus] },
        { question_id: APQ.employer.id, data: input.employer },
        { question_id: APQ.position.id, data: input.position },
      ]));
      expect(answers.length).toEqual(3);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addEmployment without employer info for employed account', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      delete input.employer;
      delete input.position;
      onboardingApplication.addEmployment(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_EMPLOYMENT_STATUS_FIELDS, fieldName: 'employer', message: expect.any(String) },
        { reason: EAccVET.MISSING_EMPLOYMENT_STATUS_FIELDS, fieldName: 'position', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(2);
    });

    it('correct behavior in addEmployment with unemployed info', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.employmentStatus = EEmploymentStatus.UNEMPLOYED;
      input.sourceOfIncome = 'crypto';
      delete input.employer;
      delete input.position;
      onboardingApplication.addEmployment(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.employmentStatus.id, data: APQ.employmentStatus.answers[input.employmentStatus] },
        { question_id: APQ.sourceOfIncome.id, data: input.sourceOfIncome },
      ]));
      expect(answers.length).toEqual(2);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addEmployment with unemployed without sourceOfIncome', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.employmentStatus = EEmploymentStatus.UNEMPLOYED;
      delete input.sourceOfIncome;
      delete input.employer;
      delete input.position;
      onboardingApplication.addEmployment(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_EMPLOYMENT_STATUS_FIELDS, fieldName: 'sourceOfIncome', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(1);
    });

    it('correct behavior in addInvestingProfile with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      onboardingApplication.addInvestingProfile(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.investingObjective.id, data: APQ.investingObjective.answers[input.investingObjective] },
        { question_id: APQ.annualIncome.id, data: APQ.annualIncome.answers[input.annualIncome] },
        { question_id: APQ.totalNetWorth.id, data: APQ.totalNetWorth.answers[input.totalNetWorth] },
        { question_id: APQ.riskTolerance.id, data: APQ.riskTolerance.answers[input.riskTolerance] },
        { question_id: APQ.investmentExperience.id, data: APQ.investmentExperience.answers[input.investmentExperience] },
        { question_id: APQ.taxBracket.id, data: input.taxBracket },
        { question_id: APQ.secondaryInvestingObjective.id, data: APQ.secondaryInvestingObjective.answers[input.secondaryInvestingObjective] },
        { question_id: APQ.liquidNetWorth.id, data: APQ.liquidNetWorth.answers[input.liquidNetWorth] },
        { question_id: APQ.liquidityNeeds.id, data: APQ.liquidityNeeds.answers[input.liquidityNeeds] },
        { question_id: APQ.timeHorizon.id, data: APQ.timeHorizon.answers[input.timeHorizon] },
      ]));
      expect(answers.length).toEqual(10);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addServiceProfile with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      onboardingApplication.addServiceProfile(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.enableSweepProgram.id, data: APQ.enableSweepProgram.answers.no },
        { question_id: APQ.actionOnSecuritiesSold.id, data: APQ.actionOnSecuritiesSold.answers[input.actionOnSecuritiesSold] },
        { question_id: APQ.dividendReinvestment.id, data: APQ.dividendReinvestment.answers.no },
        { question_id: APQ.dividendProceeds.id, data: APQ.dividendProceeds.answers[input.dividendProceeds] },
        { question_id: APQ.dividendProceedsSendFrequency.id, data: APQ.dividendProceedsSendFrequency.answers[input.dividendProceedsSendFrequency] },
      ]));
      expect(answers.length).toEqual(5);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addServiceProfile with reinvesting dividends', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      input.dividendReinvestment = true;
      delete input.dividendProceeds;
      delete input.dividendProceedsSendFrequency;
      onboardingApplication.addServiceProfile(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.enableSweepProgram.id, data: APQ.enableSweepProgram.answers.no },
        { question_id: APQ.actionOnSecuritiesSold.id, data: APQ.actionOnSecuritiesSold.answers[input.actionOnSecuritiesSold] },
        { question_id: APQ.dividendReinvestment.id, data: APQ.dividendReinvestment.answers.yes },
      ]));
      expect(answers.length).toEqual(3);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTransferOfDeath with declined field in input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TRUSTED_CONTACT) as CreateApplicationInput;
      onboardingApplication.addTransferOfDeath(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.completeTransferOfDeath.id, data: APQ.completeTransferOfDeath.answers.no },
      ]));
      expect(answers.length).toEqual(1);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTransferOfDeath with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.primaryBeneficiaryMailingAddressRegion = 'California';
      onboardingApplication.addTransferOfDeath(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.completeTransferOfDeath.id, data: APQ.completeTransferOfDeath.answers.yes },
        { question_id: PRIMARY_BENEFICIARY_QUESTION_ID, data: PRIMARY_BENEFICIARY_YES_ANSWER },
        { question_id: SECOND_BENEFICIARY_QUESTION_ID, data: SECOND_BENEFICIARY_NO_ANSWER },
        { question_id: APQ.married.id, data: APQ.married.answers.yes },
        { question_id: APQ.spouseSignatureAgreement.id, data: APQ.spouseSignatureAgreement.answers.yes },
        { question_id: APQ.spouseSignature.id, data: input.spouseSignature },
        { question_id: APQ.primaryBeneficiaryLegalName.id, data: input.primaryBeneficiaryLegalName },
        { question_id: APQ.primaryBeneficiaryDateOfBirth.id, data: dayjs(input.primaryBeneficiaryDateOfBirth).format(APEX_FORM_DATE_FORMAT) },
        { question_id: APQ.primaryBeneficiarySsn.id, data: input.primaryBeneficiarySsn },
        { question_id: APQ.primaryBeneficiarySharePercentage.id, data: input.primaryBeneficiarySharePercentage },
        { question_id: APQ.primaryBeneficiaryMailingAddressLine1.id, data: input.primaryBeneficiaryMailingAddressLine1 },
        { question_id: APQ.primaryBeneficiaryMailingAddressCity.id, data: input.primaryBeneficiaryMailingAddressCity },
        { question_id: APQ.primaryBeneficiaryMailingAddressState.id, data: input.primaryBeneficiaryMailingAddressState },
        { question_id: APQ.primaryBeneficiaryMailingAddressZipCode.id, data: input.primaryBeneficiaryMailingAddressZipCode },
        { question_id: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID, data: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_YES_ANSWER },
        { question_id: APQ.primaryBeneficiaryMailingAddressLine2.id, data: input.primaryBeneficiaryMailingAddressLine2 },
        { question_id: APQ.primaryBeneficiaryMailingAddressRegion.id, data: input.primaryBeneficiaryMailingAddressRegion },
      ]));
      expect(answers.length).toEqual(17);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTransferOfDeath for single person', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.primaryBeneficiaryMailingAddressRegion = 'California';
      input.married = false;
      delete input.spouseSignature;
      delete input.spouseSignatureAgreement;
      onboardingApplication.addTransferOfDeath(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.completeTransferOfDeath.id, data: APQ.completeTransferOfDeath.answers.yes },
        { question_id: PRIMARY_BENEFICIARY_QUESTION_ID, data: PRIMARY_BENEFICIARY_YES_ANSWER },
        { question_id: SECOND_BENEFICIARY_QUESTION_ID, data: SECOND_BENEFICIARY_NO_ANSWER },
        { question_id: APQ.married.id, data: APQ.married.answers.no },
        { question_id: APQ.primaryBeneficiaryLegalName.id, data: input.primaryBeneficiaryLegalName },
        { question_id: APQ.primaryBeneficiaryDateOfBirth.id, data: dayjs(input.primaryBeneficiaryDateOfBirth).format(APEX_FORM_DATE_FORMAT) },
        { question_id: APQ.primaryBeneficiarySsn.id, data: input.primaryBeneficiarySsn },
        { question_id: APQ.primaryBeneficiarySharePercentage.id, data: input.primaryBeneficiarySharePercentage },
        { question_id: APQ.primaryBeneficiaryMailingAddressLine1.id, data: input.primaryBeneficiaryMailingAddressLine1 },
        { question_id: APQ.primaryBeneficiaryMailingAddressCity.id, data: input.primaryBeneficiaryMailingAddressCity },
        { question_id: APQ.primaryBeneficiaryMailingAddressState.id, data: input.primaryBeneficiaryMailingAddressState },
        { question_id: APQ.primaryBeneficiaryMailingAddressZipCode.id, data: input.primaryBeneficiaryMailingAddressZipCode },
        { question_id: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID, data: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_YES_ANSWER },
        { question_id: APQ.primaryBeneficiaryMailingAddressLine2.id, data: input.primaryBeneficiaryMailingAddressLine2 },
        { question_id: APQ.primaryBeneficiaryMailingAddressRegion.id, data: input.primaryBeneficiaryMailingAddressRegion },
      ]));
      expect(answers.length).toEqual(15);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addTransferOfDeath for missing spouse\' signatures', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.primaryBeneficiaryMailingAddressRegion = 'California';
      input.married = true;
      delete input.spouseSignature;
      delete input.spouseSignatureAgreement;
      onboardingApplication.addTransferOfDeath(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'spouseSignatureAgreement', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'spouseSignature', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(2);
    });

    it('correct behavior in addTransferOfDeath with non-US primary beneficiary', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.primaryBeneficiaryMailingAddressCountry = ECountry.MEX;
      input.primaryBeneficiaryMailingAddressCity = 'Guadalajara';
      input.primaryBeneficiaryMailingAddressLine1 = 'Chicago 120, Ferrocarril';
      input.primaryBeneficiaryMailingAddressState = 'Jal.';
      input.primaryBeneficiaryMailingAddressZipCode = '44440';
      delete input.primaryBeneficiaryMailingAddressLine2;
      onboardingApplication.addTransferOfDeath(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.completeTransferOfDeath.id, data: APQ.completeTransferOfDeath.answers.yes },
        { question_id: PRIMARY_BENEFICIARY_QUESTION_ID, data: PRIMARY_BENEFICIARY_YES_ANSWER },
        { question_id: SECOND_BENEFICIARY_QUESTION_ID, data: SECOND_BENEFICIARY_NO_ANSWER },
        { question_id: APQ.married.id, data: input.married ? APQ.married.answers.yes : APQ.married.answers.no },
        { question_id: APQ.spouseSignatureAgreement.id, data: APQ.spouseSignatureAgreement.answers.yes },
        { question_id: APQ.spouseSignature.id, data: input.spouseSignature },
        { question_id: APQ.primaryBeneficiaryLegalName.id, data: input.primaryBeneficiaryLegalName },
        { question_id: APQ.primaryBeneficiaryDateOfBirth.id, data: dayjs(input.primaryBeneficiaryDateOfBirth).format(APEX_FORM_DATE_FORMAT) },
        { question_id: APQ.primaryBeneficiarySsn.id, data: input.primaryBeneficiarySsn },
        { question_id: APQ.primaryBeneficiarySharePercentage.id, data: input.primaryBeneficiarySharePercentage },
        { question_id: APQ.primaryBeneficiaryMailingAddressLine1.id, data: input.primaryBeneficiaryMailingAddressLine1 },
        { question_id: APQ.primaryBeneficiaryMailingAddressCity.id, data: input.primaryBeneficiaryMailingAddressCity },
        { question_id: APQ.primaryBeneficiaryMailingAddressState.id, data: input.primaryBeneficiaryMailingAddressState },
        { question_id: APQ.primaryBeneficiaryMailingAddressZipCode.id, data: input.primaryBeneficiaryMailingAddressZipCode },
        { question_id: APQ.primaryBeneficiaryMailingAddressCountry.id, data: input.primaryBeneficiaryMailingAddressCountry },
        { question_id: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID, data: IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_NO_ANSWER },
      ]));
      expect(answers.length).toEqual(16);
      checkIfApplicationHasNoErrors();
    });

    it('handles missing fields in addTransferOfDeath', () => {
      const input = copyInput(VALID_PAYLOAD_WITHOUT_TOD_AND_ONLY_RESIDENTIAL_ADDRESS) as CreateApplicationInput;
      input.completeTransferOfDeath = true;
      onboardingApplication.addTransferOfDeath(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'married', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryLegalName', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryDateOfBirth', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiarySsn', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiarySharePercentage', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressCountry', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressLine1', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressCity', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressState', message: expect.any(String) },
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_FIELDS, fieldName: 'primaryBeneficiaryMailingAddressZipCode', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(10);
    });

    it('correct behavior in addLegalDisclosures with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.completeTransferOfDeath = true;
      onboardingApplication.addLegalDisclosures(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.transferOnDeathBeneficiaryDesignation.id, data: APQ.transferOnDeathBeneficiaryDesignation.answers.yes },
        { question_id: APQ.customerAccountAgreement.id, data: APQ.customerAccountAgreement.answers.yes },
        { question_id: APQ.customerAccountAgreementCustodian.id, data: APQ.customerAccountAgreementCustodian.answers.yes },
      ]));
      expect(answers.length).toEqual(3);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addLegalDisclosures with missing agreements', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.completeTransferOfDeath = true;
      input.transferOnDeathBeneficiaryDesignation = false;
      input.customerAccountAgreement = false;
      input.customerAccountAgreementCustodian = false;
      onboardingApplication.addLegalDisclosures(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_TRANSFER_ON_DEATH_AGREEMENT, fieldName: 'transferOnDeathBeneficiaryDesignation', message: expect.any(String) },
        { reason: EAccVET.MISSING_CUSTOMER_AGREEMENT, fieldName: 'customerAccountAgreement', message: expect.any(String) },
        { reason: EAccVET.MISSING_CUSTOMER_CUSTODIAN_AGREEMENT, fieldName: 'customerAccountAgreementCustodian', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(3);
    });

    it('correct behavior in addSignatures with valid input', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.completeTransferOfDeath = true;
      onboardingApplication.addSignatures(input);
      const answers = onboardingApplication.getForm();
      expect(answers).toEqual(expect.arrayContaining([
        { question_id: APQ.signaturePrimaryApplicant.id, data: input.signaturePrimaryApplicant },
      ]));
      expect(answers.length).toEqual(1);
      checkIfApplicationHasNoErrors();
    });

    it('correct behavior in addSignatures with missing agreements', () => {
      const input = copyInput(VALID_PAYLOAD_WITH_TOD_TRUSTED_CONTACT_MAILING_ADDRESS) as CreateApplicationInput;
      input.signaturePrimaryApplicant = '';
      onboardingApplication.addSignatures(input);
      const { validationErrors } = onboardingApplication.getErrors();
      expect(validationErrors).toEqual(expect.arrayContaining([
        { reason: EAccVET.MISSING_PRIMARY_APPLICANT_SIGNATURE, fieldName: 'signaturePrimaryApplicant', message: expect.any(String) },
      ]));
      expect(validationErrors.length).toEqual(1);
    });
  });
});
