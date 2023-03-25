import {
  CLIENT_NAME,
  EMPLOYEE_COUNT,
  EMPLOYEE_TOTAL,
  PARTICIPATING_EMPLOYEES,
  MEMBERS_COUNT,
  RETIREES_COUNT,
  MINIMUM_HOURS,
  COBRA_COUNT,
  EFFECTIVE_DATE,
  DUE_DATE,
  SITUS_STATE,
  PREDOMINANT_COUNTY,
  AVERAGE_AGE,
  SIC_CODE,
  ADDRESS,
  CITY,
  ZIP,
  STATE,
  DOMESTIC_PARTNER,
  OUT_TO_BID_REASON,
} from '@benrevo/benrevo-react-clients';
import {
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
} from './../constants';
import { validateInfo, validateOptions, validateContribution, validateQuote, validateCaptureRates, validateClientInfo, validateSection } from '../FormValidator';

describe('FormValidator', () => {
  const baseProps = {
    setError: () => {},
    deleteError: () => {},
    setValid: () => {},
    complete: true,
    virginCoverage: {
      medical: false,
      dental: false,
      vision: false,
      life: false,
      std: false,
      ltd: false,
    },
  };
  const plans = [{
    contributionAmount: [{ value: '1' }],
    outOfStateAmountTiers: [{ value: '0.5' }],
    currentRates: [{ value: '1' }],
    contributionEnrollment: [{ value: '1' }],
    outOfStateCurrentTiers: [{ value: '1' }],
    renewalRates: [{ value: '1' }],
    outOfStateRenewalTiers: [{ value: '1' }],
    title: 'test',
    name: 'test 100',
    selectedCarrier: { carrierId: 1 },
    selectedNetwork: { networkId: 1 },
  }];
  const plansInvalid = [{
    outOfStateCurrent: true,
    outOfStateRenewal: true,
    currentRates: [{ value: '' }],
    contributionEnrollment: [{ value: '' }],
    outOfStateCurrentTiers: [{ value: '' }],
    renewalRates: [{ value: '1' }],
    outOfStateRenewalTiers: [{ value: 'test' }],
    selectedCarrier: { carrierId: null },
    selectedNetwork: { networkId: null },
  }];
  const plansInvalid2 = [{
    outOfStateCurrent: true,
    outOfStateRenewal: true,
    currentRates: [{ value: '1' }],
    contributionEnrollment: [{ value: '1' }],
    outOfStateCurrentTiers: [{ value: '' }],
    renewalRates: [{ value: 'test' }],
    outOfStateRenewalTiers: [{ value: 'test' }],
    selectedCarrier: { carrierId: null },
    selectedNetwork: { networkId: null },
  }];
  const infoProps = {
    ...baseProps,
    daysAfterHire: 'Date of hire',
    commission: '0',
    previousCarrier: 'yes',
    carriers: [{
      title: 'test',
      years: '1',
    }],
    previousCarriers: [{
      title: 'test',
      years: '1',
    }],
  };
  const optionsProps = {
    ...baseProps,
    plans,
  };
  const contributionProps = {
    ...baseProps,
    plans,
  };
  const clientInfoProps = {
    ...baseProps,
    client: {
      [CLIENT_NAME]: 'test',
      [SIC_CODE]: '213',
      [CITY]: 'test',
      [ZIP]: 'test',
      [ADDRESS]: 'test',
      [STATE]: 'California',
      [DOMESTIC_PARTNER]: 'test',
      [OUT_TO_BID_REASON]: 'test',
      [EMPLOYEE_COUNT]: '10',
      [EMPLOYEE_TOTAL]: '10',
      [PARTICIPATING_EMPLOYEES]: '10',
      [MEMBERS_COUNT]: '10',
      [RETIREES_COUNT]: '10',
      [MINIMUM_HOURS]: '10',
      [COBRA_COUNT]: '10',
      [EFFECTIVE_DATE]: '10',
      [DUE_DATE]: '10',
      [SIC_CODE]: '10',
      [SITUS_STATE]: 'California',
      [PREDOMINANT_COUNTY]: 'San Diego',
      [AVERAGE_AGE]: '35',
    },
  };
  const clientInfoPropsInvalid = {
    ...baseProps,
    client: {
      [CLIENT_NAME]: '',
      [EMPLOYEE_COUNT]: 'test',
      [EMPLOYEE_TOTAL]: 'test',
      [PARTICIPATING_EMPLOYEES]: 'test',
      [MEMBERS_COUNT]: 'test',
      [RETIREES_COUNT]: 'test',
      [MINIMUM_HOURS]: 'test',
      [AVERAGE_AGE]: 'test',
      [PREDOMINANT_COUNTY]: 'test',
    },
  };
  describe('Info page', () => {
    it('info page: all ok', () => {
      expect(validateInfo(infoProps, RFP_MEDICAL_SECTION)).toEqual(true);
    });

    it('info page: error in carriers', () => {
      expect(validateInfo({ ...infoProps, carriers: [{ title: '' }] }, RFP_MEDICAL_SECTION)).toEqual(false);
    });

    it('info page: error in daysAfterHire', () => {
      expect(validateInfo({ ...infoProps, daysAfterHire: '' }, RFP_MEDICAL_SECTION)).toEqual(false);
    });

    it('info page: error in commission', () => {
      expect(validateInfo({ ...infoProps, commission: '' }, RFP_MEDICAL_SECTION)).toEqual(false);
    });
  });

  describe('validateOptions', () => {
    it('options page: all ok', () => {
      expect(validateOptions(optionsProps, RFP_MEDICAL_SECTION)).toEqual(true);
    });

    it('options page: error in plans', () => {
      expect(validateOptions({ ...optionsProps, plans: [{ title: '' }] }, RFP_MEDICAL_SECTION)).toEqual(false);
    });
  });

  describe('validateContribution', () => {
    it('contribution page: all ok', () => {
      expect(validateContribution(contributionProps, RFP_MEDICAL_SECTION)).toEqual(true);
    });

    it('contribution page: all possible errors', () => {
      expect(validateContribution({ ...contributionProps, plans: [{ outOfStateAmount: true, contributionAmount: [{ value: '' }], outOfStateAmountTiers: [{ value: 'test' }] }] }, RFP_MEDICAL_SECTION)).toEqual(false);
    });
  });

  describe('validateQuote', () => {
    it('should be validate quote page', () => {
      expect(validateQuote({ ...plans,
        virginCoverage: {
          medical: false,
          dental: false,
          vision: false,
          life: false,
          std: false,
          ltd: false,
        },
        diagnosisAndStatus: 'test' }, RFP_MEDICAL_SECTION)).toEqual(true);
    });
  });

  describe('validateCaptureRates', () => {
    it('apture rates page: all ok', () => {
      expect(validateCaptureRates({ ...baseProps, plans }, RFP_MEDICAL_SECTION)).toEqual(true);
    });

    it('apture rates page: error in outOfStateRenewalTiers', () => {
      expect(validateCaptureRates({ ...baseProps, plans: plansInvalid }, RFP_MEDICAL_SECTION)).toEqual(false);
    });

    it('apture rates page: error in outOfStateCurrentTiers', () => {
      expect(validateCaptureRates({ ...baseProps, plans: plansInvalid2 }, RFP_MEDICAL_SECTION)).toEqual(false);
    });
  });

  describe('validateClientInfo', () => {
    it('client info page: all ok', () => {
      expect(validateClientInfo(clientInfoProps, 'client')).toEqual(true);
    });

    it('client info page: all possible errors', () => {
      expect(validateClientInfo(clientInfoPropsInvalid, 'client')).toEqual(false);
    });
  });

  describe('validateSection', () => {
    it('should be validate all pages', () => {
      expect(validateSection(
        {
          ...baseProps,
          medical: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          dental: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          vision: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          dentalFiles: {},
          visionFiles: {},
          filesSummary: [],
          client: { ...clientInfoProps.client },
          selected: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
          setPageValid: jest.fn(),
          setValid: jest.fn(),
          products: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
          virginCoverage: {
            medical: false,
            dental: false,
            vision: false,
            life: false,
            std: false,
            ltd: false,
          },
        }
      )).toEqual([RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION]);
    });

    it('any error', () => {
      expect(validateSection(
        {
          ...baseProps,
          medical: { ...infoProps, ...optionsProps, ...contributionProps, amountOfDaysAfterHire: 'test', rfpPlans: [] },
          dental: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          vision: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          dentalFiles: {},
          visionFiles: {},
          filesSummary: [],
          client: { ...clientInfoProps.client },
          selected: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
          setPageValid: jest.fn(),
          setValid: jest.fn(),
          products: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
        }
      )).toEqual([RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION]);
    });

    it('medical.complete is undefined', () => {
      expect(validateSection(
        {
          ...baseProps,
          medical: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          dental: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          vision: { ...infoProps, ...optionsProps, ...contributionProps, rfpPlans: [] },
          client: { ...clientInfoProps.client },
          dentalFiles: {},
          visionFiles: {},
          filesSummary: [],
          selected: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
          setPageValid: jest.fn(),
          setValid: jest.fn(),
          products: {
            medical: true,
            dental: true,
            vision: true,
            life: true,
            std: true,
            ltd: true,
          },
        }
      )).toEqual([RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION]);
    });
  });
});
