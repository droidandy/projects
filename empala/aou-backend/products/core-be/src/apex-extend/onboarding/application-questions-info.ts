export const INDIVIDUAL_CUSTOMER_TYPE_QUESTION_ID = 10647;
export const INDIVIDUAL_CUSTOMER_TYPE_ANSWER = 10930;
export const CASH_ACCOUNT_TYPE_QUESTION_ID = 10648;
export const CASH_ACCOUNT_TYPE_ANSWER = 10931;
export const OPTIONS_TRADING_QUESTION_ID = 10649;
export const OPTIONS_TRADING_ANSWER = 10934;
export const US_CITIZEN_QUESTION_ID = 10656;
export const US_CITIZEN_YES_ANSWER = 10938;
export const IS_CURRENT_ADDRESS_US_QUESTION_ID = 10666;
export const IS_CURRENT_ADDRESS_US_YES_ANSWER = 10953;
export const IS_CURRENT_ADDRESS_US_NO_ANSWER = 10954;
export const IS_CURRENT_MAILING_ADDRESS_US_QUESTION_ID = 10677;
export const IS_CURRENT_MAILING_ADDRESS_US_YES_ANSWER = 10957;
export const IS_CURRENT_MAILING_ADDRESS_US_NO_ANSWER = 10958;
export const IS_TRUSTED_CONTACT_LOCATED_IN_US_QUESTION_ID = 10703;
export const IS_TRUSTED_CONTACT_LOCATED_IN_US_YES_ANSWER = 10975;
export const IS_TRUSTED_CONTACT_LOCATED_IN_US_NO_ANSWER = 10976;
export const PRIMARY_BENEFICIARY_QUESTION_ID = 10735;
export const PRIMARY_BENEFICIARY_YES_ANSWER = 11049;
export const IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_QUESTION_ID = 10740;
export const IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_YES_ANSWER = 11050;
export const IS_PRIMARY_BENEFICIARY_LOCATED_IN_US_NO_ANSWER = 11051;
export const SECOND_BENEFICIARY_QUESTION_ID = 10748;
export const SECOND_BENEFICIARY_NO_ANSWER = 11053;

interface QuestionsInfo {
  [key: string]: {
    id: number;
    answers?: {
      [key: string]: number;
      yes?: number;
      no?: number;
    };
    specialCases?: any;
  };
}

export const APEX_APPLICATION_QUESTIONS: QuestionsInfo = {
  accountType: {
    id: 10648,
  },
  firstName: {
    id: 10651,
  },
  lastName: {
    id: 10653,
  },
  middleName: {
    id: 10652,
  },
  dateOfBirth: {
    id: 10655,
  },
  citizenshipCountry: {
    id: 10657,
  },
  isPermanentUsResident: {
    id: 10659,
  },
  isUsResidentWithVisa: {
    id: 10661,
  },
  visaType: {
    id: 10662,
  },
  visaExpiration: {
    id: 10663,
  },
  birthCountry: {
    id: 10665,
  },
  ssn: {
    id: 10658,
    specialCases: {
      permanentResident: {
        id: 10664,
      },
      resident: {
        id: 10660,
      },
    },
  },
  email: {
    id: 10675,
  },
  phoneNumber: {
    id: 10674,
  },
  residentialAddressCountry: {
    id: 10667,
  },
  residentialAddressLine1: {
    id: 10668,
  },
  residentialAddressLine2: {
    id: 10669,
  },
  residentialAddressCity: {
    id: 10670,
  },
  residentialAddressRegion: {
    id: 10671,
  },
  residentialAddressState: {
    id: 10672,
  },
  residentialAddressZipCode: {
    id: 10673,
  },
  isMailingAddressSameAsResidentialAddress: {
    id: 10676,
    answers: {
      yes: 10955,
      no: 10956,
    },
  },
  mailingAddressCountry: {
    id: 10678,
  },
  mailingAddressLine1: {
    id: 10679,
  },
  mailingAddressLine2: {
    id: 10680,
  },
  mailingAddressCity: {
    id: 10681,
  },
  mailingAddressRegion: {
    id: 10682,
  },
  mailingAddressState: {
    id: 10683,
  },
  mailingAddressZipCode: {
    id: 10684,
  },
  isAccountMaintainedForPoliticalOrPublicPerson: {
    id: 10685,
    answers: {
      yes: 10959,
      no: 10960,
    },
  },
  officialNameAndFamilyMembersNames: {
    id: 10686,
  },
  nameOfPoliticalOrganization: {
    id: 10687,
  },
  isAccountHolderIsControlHolderOfPublicCompany: {
    id: 10688,
    answers: {
      yes: 10961,
      no: 10962,
    },
  },
  listOfHoldedCompanies: {
    id: 10689,
  },
  isAffiliatedWithExchangeOrFINRA: {
    id: 10690,
    answers: {
      yes: 10963,
      no: 10964,
    },
  },
  nameOfAffiliatedFirm: {
    id: 10691,
  },
  isThirdPartyTradingAuthorizationGranted: {
    id: 10692,
    answers: {
      yes: 10965,
      no: 10966,
    },
  },
  nameOfThirdPartyAgent: {
    id: 10693,
  },
  accountLocationType: {
    id: 10698,
    answers: {
      domestic: 10973,
      foreign: 10974,
    },
  },
  areYou55OrOlder: {
    id: 10694,
    answers: {
      yes: 10967,
      no: 10968,
    },
  },
  doYouWantToAddTrustedContactInformation: {
    id: 10695,
    answers: {
      yes: 10969,
      no: 10970,
    },
  },
  trustedContactFirstName: {
    id: 10699,
  },
  trustedContactLastName: {
    id: 10700,
  },
  trustedContactPhoneNumber: {
    id: 10701,
  },
  trustedContactEmail: {
    id: 10702,
  },
  trustedContactCountry: {
    id: 10704,
  },
  trustedContactAddressLine1: {
    id: 10705,
  },
  trustedContactAddressLine2: {
    id: 10706,
  },
  trustedContactCity: {
    id: 10707,
  },
  trustedContactRegion: {
    id: 10708,
  },
  trustedContactState: {
    id: 10709,
  },
  trustedContactZipCode: {
    id: 10710,
  },
  trustedContactDisclosureAgreement: {
    id: 10711,
    answers: {
      yes: 10977,
    },
  },
  employmentStatus: {
    id: 10712,
    answers: {
      EMPLOYED: 10978,
      UNEMPLOYED: 10979,
      RETIRED: 10980,
      STUDENT: 10981,
    },
  },
  employer: {
    id: 10713,
  },
  position: {
    id: 10714,
  },
  sourceOfIncome: {
    id: 10715,
  },
  investingObjective: {
    id: 10716,
    answers: {
      CAPITAL_PRESERVATION: 10982,
      INCOME: 10983,
      GROWTH: 10984,
      SPECULATION: 10985,
      GROWTH_INCOME: 10986,
      MAXIMUM_GROWTH: 10987,
      BALANCED: 10988,
      OTHER: 10989,
    },
  },
  secondaryInvestingObjective: {
    id: 10717,
    answers: {
      CAPITAL_PRESERVATION: 10990,
      INCOME: 10991,
      GROWTH: 10992,
      SPECULATION: 10993,
      GROWTH_INCOME: 10994,
      MAXIMUM_GROWTH: 10995,
      BALANCED: 10996,
      OTHER: 10997,
    },
  },
  annualIncome: {
    id: 10718,
    answers: {
      UNDER_25000: 10998,
      FROM_25001_TO_50000: 10999,
      FROM_50001_TO_100000: 11001,
      FROM_100001_TO_200000: 11002,
      FROM_200001_TO_300000: 11003,
      FROM_300001_TO_500000: 11004,
      FROM_500001_TO_1200001: 11005,
      OVER_1200001: 11006,
    },
  },
  liquidNetWorth: {
    id: 10719,
    answers: {
      UNDER_50000: 11006,
      FROM_50001_TO_100000: 11007,
      FROM_100001_TO_200000: 11008,
      FROM_200001_TO_500000: 11009,
      FROM_500001_TO_1000000: 11010,
      FROM_1000001_TO_5000000: 11011,
      OVER_5000001: 11012,
    },
  },
  totalNetWorth: {
    id: 10720,
    answers: {
      UNDER_50000: 11013,
      FROM_50001_TO_100000: 11014,
      FROM_100001_TO_200000: 11015,
      FROM_200001_TO_500000: 11016,
      FROM_500001_TO_1000000: 11017,
      FROM_1000001_TO_5000000: 11018,
      OVER_5000001: 11019,
    },
  },
  riskTolerance: {
    id: 10721,
    answers: {
      LOW: 11020,
      MEDIUM: 11021,
      HIGH: 11022,
    },
  },
  liquidityNeeds: {
    id: 10722,
    answers: {
      VERY_IMPORTANT: 11023,
      SOMEWHAT_IMPORTANT: 11024,
      NOT_IMPORTANT: 11025,
    },
  },
  timeHorizon: {
    id: 10723,
    answers: {
      SHORT: 11026,
      AVERAGE: 11027,
      LONG: 11028,
    },
  },
  investmentExperience: {
    id: 10724,
    answers: {
      NONE: 11029,
      LIMITED: 11030,
      GOOD: 11031,
      EXTENSIVE: 11032,
    },
  },
  taxBracket: {
    id: 10725,
  },
  enableSweepProgram: {
    id: 10726,
    answers: {
      yes: 11033,
      no: 11034,
    },
  },
  actionOnSecuritiesSold: {
    id: 10727,
    answers: {
      HOLD_PROCEEDS: 11035,
      SEND_PROCEEDS: 11036,
    },
  },
  dividendReinvestment: {
    id: 10728,
    answers: {
      yes: 11037,
      no: 11038,
    },
  },
  dividendProceeds: {
    id: 10729,
    answers: {
      SEND: 11039,
      HOLD: 11040,
    },
  },
  dividendProceedsSendFrequency: {
    id: 10730,
    answers: {
      DAILY: 11041,
      WEEKLY: 11042,
      MONTHLY: 11043,
    },
  },
  completeTransferOfDeath: {
    id: 10731,
    answers: {
      yes: 11044,
      no: 11045,
    },
  },
  married: {
    id: 10732,
    answers: {
      yes: 11046,
      no: 11047,
    },
  },
  spouseSignatureAgreement: {
    id: 10733,
    answers: {
      yes: 11048,
    },
  },
  spouseSignature: {
    id: 10734,
  },
  primaryBeneficiaryLegalName: {
    id: 10736,
  },
  primaryBeneficiaryDateOfBirth: {
    id: 10737,
  },
  primaryBeneficiarySsn: {
    id: 10738,
  },
  primaryBeneficiarySharePercentage: {
    id: 10739,
  },
  primaryBeneficiaryMailingAddressCountry: {
    id: 10741,
  },
  primaryBeneficiaryMailingAddressLine1: {
    id: 10742,
  },
  primaryBeneficiaryMailingAddressLine2: {
    id: 10743,
  },
  primaryBeneficiaryMailingAddressCity: {
    id: 10744,
  },
  primaryBeneficiaryMailingAddressRegion: {
    id: 10745,
  },
  primaryBeneficiaryMailingAddressState: {
    id: 10746,
  },
  primaryBeneficiaryMailingAddressZipCode: {
    id: 10747,
  },
  transferOnDeathBeneficiaryDesignation: {
    id: 10804,
    answers: {
      yes: 11076,
    },
  },
  customerAccountAgreement: {
    id: 10805,
    answers: {
      yes: 11077,
    },
  },
  customerAccountAgreementCustodian: {
    id: 10812,
    answers: {
      yes: 11087,
    },
  },
  signaturePrimaryApplicant: {
    id: 10814,
  },
};

export const APEX_QUESTION_ID_TO_FIELD_NAME_MAP: Map<number, string> = new Map();

for (const fieldName of Object.keys(APEX_APPLICATION_QUESTIONS)) {
  APEX_QUESTION_ID_TO_FIELD_NAME_MAP.set(APEX_APPLICATION_QUESTIONS[(fieldName as keyof typeof APEX_APPLICATION_QUESTIONS)].id, fieldName);
}
