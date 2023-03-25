export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  OrderId: any;
};

export type CreateApplicationInput = {
  accountLocationType: EAccountLocationType;
  accountType: EAccountType;
  actionOnSecuritiesSold?: InputMaybe<ESecuritiesAction>;
  annualIncome: EAnnualIncome;
  areYou55OrOlder: Scalars['Boolean'];
  birthCountry?: InputMaybe<ECountry>;
  citizenshipCountry: ECountry;
  completeTransferOfDeath?: InputMaybe<Scalars['Boolean']>;
  customerAccountAgreement?: InputMaybe<Scalars['Boolean']>;
  customerAccountAgreementCustodian: Scalars['Boolean'];
  dateOfBirth: Scalars['DateTime'];
  dividendProceeds?: InputMaybe<EDividendProceedsAction>;
  dividendProceedsSendFrequency?: InputMaybe<EDividendProceedsSendFrequency>;
  dividendReinvestment?: InputMaybe<Scalars['Boolean']>;
  doYouWantToAddTrustedContactInformation: Scalars['Boolean'];
  email: Scalars['String'];
  employer?: InputMaybe<Scalars['String']>;
  employmentStatus: EEmploymentStatus;
  enableSweepProgram?: InputMaybe<Scalars['Boolean']>;
  firstName: Scalars['String'];
  investingObjective: EInvestmentObjective;
  investmentExperience: EInvestmentExperience;
  isAccountHolderIsControlHolderOfPublicCompany: Scalars['Boolean'];
  isAccountMaintainedForPoliticalOrPublicPerson: Scalars['Boolean'];
  isAffiliatedWithExchangeOrFINRA: Scalars['Boolean'];
  isMailingAddressSameAsResidentialAddress: Scalars['Boolean'];
  isPermanentUsResident?: InputMaybe<Scalars['Boolean']>;
  isThirdPartyTradingAuthorizationGranted: Scalars['Boolean'];
  isUsResidentWithVisa?: InputMaybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  liquidNetWorth?: InputMaybe<ENetWorth>;
  liquidityNeeds?: InputMaybe<ELiquidityNeeds>;
  listOfHoldedCompanies?: InputMaybe<Scalars['String']>;
  mailingAddressCity?: InputMaybe<Scalars['String']>;
  mailingAddressCountry?: InputMaybe<ECountry>;
  mailingAddressLine1?: InputMaybe<Scalars['String']>;
  mailingAddressLine2?: InputMaybe<Scalars['String']>;
  mailingAddressRegion?: InputMaybe<Scalars['String']>;
  mailingAddressState?: InputMaybe<Scalars['String']>;
  mailingAddressZipCode?: InputMaybe<Scalars['String']>;
  married?: InputMaybe<Scalars['Boolean']>;
  middleName?: InputMaybe<Scalars['String']>;
  nameOfAffiliatedFirm?: InputMaybe<Scalars['String']>;
  nameOfPoliticalOrganization?: InputMaybe<Scalars['String']>;
  nameOfThirdPartyAgent?: InputMaybe<Scalars['String']>;
  officialNameAndFamilyMembersNames?: InputMaybe<Scalars['String']>;
  phoneNumber: Scalars['String'];
  position?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryDateOfBirth?: InputMaybe<Scalars['DateTime']>;
  primaryBeneficiaryLegalName?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressCity?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressCountry?: InputMaybe<ECountry>;
  primaryBeneficiaryMailingAddressLine1?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressLine2?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressRegion?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressState?: InputMaybe<Scalars['String']>;
  primaryBeneficiaryMailingAddressZipCode?: InputMaybe<Scalars['String']>;
  primaryBeneficiarySharePercentage?: InputMaybe<Scalars['Int']>;
  primaryBeneficiarySsn?: InputMaybe<Scalars['String']>;
  residentialAddressCity: Scalars['String'];
  residentialAddressCountry: ECountry;
  residentialAddressLine1: Scalars['String'];
  residentialAddressLine2?: InputMaybe<Scalars['String']>;
  residentialAddressRegion?: InputMaybe<Scalars['String']>;
  residentialAddressState: Scalars['String'];
  residentialAddressZipCode: Scalars['String'];
  riskTolerance: ERiskTolerance;
  secondaryInvestingObjective?: InputMaybe<EInvestmentObjective>;
  signaturePrimaryApplicant: Scalars['String'];
  sourceOfIncome?: InputMaybe<Scalars['String']>;
  spouseSignature?: InputMaybe<Scalars['String']>;
  spouseSignatureAgreement?: InputMaybe<Scalars['Boolean']>;
  ssn: Scalars['String'];
  taxBracket: Scalars['String'];
  timeHorizon?: InputMaybe<ETimeHorizon>;
  totalNetWorth: ENetWorth;
  transferOnDeathBeneficiaryDesignation?: InputMaybe<Scalars['Boolean']>;
  trustedContactAddressLine1?: InputMaybe<Scalars['String']>;
  trustedContactAddressLine2?: InputMaybe<Scalars['String']>;
  trustedContactCity?: InputMaybe<Scalars['String']>;
  trustedContactCountry?: InputMaybe<ECountry>;
  trustedContactDisclosureAgreement?: InputMaybe<Scalars['Boolean']>;
  trustedContactEmail?: InputMaybe<Scalars['String']>;
  trustedContactFirstName?: InputMaybe<Scalars['String']>;
  trustedContactLastName?: InputMaybe<Scalars['String']>;
  trustedContactPhoneNumber?: InputMaybe<Scalars['String']>;
  trustedContactRegion?: InputMaybe<Scalars['String']>;
  trustedContactState?: InputMaybe<Scalars['String']>;
  trustedContactZipCode?: InputMaybe<Scalars['String']>;
  visaExpiration?: InputMaybe<Scalars['DateTime']>;
  visaType?: InputMaybe<EVisaType>;
};

export type CreateExchangeInput = {
  name: Scalars['String'];
};

export type CreateFractionalOrderInput = {
  instId: Scalars['ID'];
  quantity: Scalars['Float'];
  transactionType: ETransactionType;
};

export type CreateHunchInput = {
  byDate: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  instId: Scalars['ID'];
  targetPrice: Scalars['Float'];
};

export type CreateInstrumentInput = {
  country: ECountry;
  cusip?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  exchangeName: Scalars['String'];
  sedol?: InputMaybe<Scalars['String']>;
  shortDescription: Scalars['String'];
  symbol: Scalars['String'];
  type: EInstrumentType;
};

export type CreateNotionalOrderInput = {
  instId: Scalars['ID'];
  notionalValue: Scalars['Float'];
  transactionType: ETransactionType;
};

export type CreateOrderInput = {
  instId: Scalars['ID'];
  limitPrice?: InputMaybe<Scalars['Float']>;
  orderType: EOrderType;
  quantity: Scalars['Int'];
  stopPrice?: InputMaybe<Scalars['Float']>;
  transactionType: ETransactionType;
};

export type CreateStackInput = {
  instIds: Array<Scalars['ID']>;
  name: Scalars['String'];
};

export type CreateTagsInput = {
  instId: Scalars['ID'];
  themeIds: Array<Scalars['ID']>;
};

export type CreateUserInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  fullName: Scalars['String'];
  stacks: Array<CreateStackInput>;
  tags: Array<CreateTagsInput>;
};

export enum EAccountLocationType {
  DOMESTIC = 'DOMESTIC',
  FOREIGN = 'FOREIGN'
}

export enum EAccountType {
  CASH = 'CASH'
}

export enum EAccountValidationErrorType {
  INVALID_DATE_OF_BIRTH = 'INVALID_DATE_OF_BIRTH',
  MISSING_CUSTOMER_AGREEMENT = 'MISSING_CUSTOMER_AGREEMENT',
  MISSING_CUSTOMER_CUSTODIAN_AGREEMENT = 'MISSING_CUSTOMER_CUSTODIAN_AGREEMENT',
  MISSING_EMPLOYMENT_STATUS_FIELDS = 'MISSING_EMPLOYMENT_STATUS_FIELDS',
  MISSING_MAILING_ADDRESS_FIELDS = 'MISSING_MAILING_ADDRESS_FIELDS',
  MISSING_PRIMARY_APPLICANT_SIGNATURE = 'MISSING_PRIMARY_APPLICANT_SIGNATURE',
  MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT = 'MISSING_THIRD_PARTY_AUTHORIZED_TRADING_AGENT',
  MISSING_TRANSFER_ON_DEATH_AGREEMENT = 'MISSING_TRANSFER_ON_DEATH_AGREEMENT',
  MISSING_TRANSFER_ON_DEATH_FIELDS = 'MISSING_TRANSFER_ON_DEATH_FIELDS',
  MISSING_TRUSTED_CONTACT_FIELDS = 'MISSING_TRUSTED_CONTACT_FIELDS',
  TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER = 'TRUSTED_CONTACT_MISSING_FOR_55_OR_OLDER_USER'
}

export enum EAnnualIncome {
  FROM_25001_TO_50000 = 'FROM_25001_TO_50000',
  FROM_50001_TO_100000 = 'FROM_50001_TO_100000',
  FROM_100001_TO_200000 = 'FROM_100001_TO_200000',
  FROM_200001_TO_300000 = 'FROM_200001_TO_300000',
  FROM_300001_TO_500000 = 'FROM_300001_TO_500000',
  FROM_500001_TO_1200001 = 'FROM_500001_TO_1200001',
  OVER_1200001 = 'OVER_1200001',
  UNDER_25000 = 'UNDER_25000'
}

export enum EApplicationStatus {
  APPLICATION_VALIDATION_FAILED = 'APPLICATION_VALIDATION_FAILED',
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
  IN_REVIEW = 'IN_REVIEW'
}

export enum ECountry {
  ABW = 'ABW',
  AFG = 'AFG',
  AGO = 'AGO',
  AIA = 'AIA',
  ALA = 'ALA',
  ALB = 'ALB',
  AND = 'AND',
  ARE = 'ARE',
  ARG = 'ARG',
  ARM = 'ARM',
  ASM = 'ASM',
  ATA = 'ATA',
  ATF = 'ATF',
  ATG = 'ATG',
  AUS = 'AUS',
  AUT = 'AUT',
  AZE = 'AZE',
  BDI = 'BDI',
  BEL = 'BEL',
  BEN = 'BEN',
  BES = 'BES',
  BFA = 'BFA',
  BGD = 'BGD',
  BGR = 'BGR',
  BHR = 'BHR',
  BHS = 'BHS',
  BIH = 'BIH',
  BLM = 'BLM',
  BLR = 'BLR',
  BLZ = 'BLZ',
  BMU = 'BMU',
  BOL = 'BOL',
  BRA = 'BRA',
  BRB = 'BRB',
  BRN = 'BRN',
  BTN = 'BTN',
  BVT = 'BVT',
  BWA = 'BWA',
  CAF = 'CAF',
  CAN = 'CAN',
  CCK = 'CCK',
  CHE = 'CHE',
  CHL = 'CHL',
  CHN = 'CHN',
  CIV = 'CIV',
  CMR = 'CMR',
  COD = 'COD',
  COG = 'COG',
  COK = 'COK',
  COL = 'COL',
  COM = 'COM',
  CPV = 'CPV',
  CRI = 'CRI',
  CUB = 'CUB',
  CUW = 'CUW',
  CXR = 'CXR',
  CYM = 'CYM',
  CYP = 'CYP',
  CZE = 'CZE',
  DEU = 'DEU',
  DJI = 'DJI',
  DMA = 'DMA',
  DNK = 'DNK',
  DOM = 'DOM',
  DZA = 'DZA',
  ECU = 'ECU',
  EGY = 'EGY',
  ERI = 'ERI',
  ESH = 'ESH',
  ESP = 'ESP',
  EST = 'EST',
  ETH = 'ETH',
  FIN = 'FIN',
  FJI = 'FJI',
  FLK = 'FLK',
  FRA = 'FRA',
  FRO = 'FRO',
  FSM = 'FSM',
  GAB = 'GAB',
  GBR = 'GBR',
  GEO = 'GEO',
  GGY = 'GGY',
  GHA = 'GHA',
  GIB = 'GIB',
  GIN = 'GIN',
  GLP = 'GLP',
  GMB = 'GMB',
  GNB = 'GNB',
  GNQ = 'GNQ',
  GRC = 'GRC',
  GRD = 'GRD',
  GRL = 'GRL',
  GTM = 'GTM',
  GUF = 'GUF',
  GUM = 'GUM',
  GUY = 'GUY',
  HKG = 'HKG',
  HMD = 'HMD',
  HND = 'HND',
  HRV = 'HRV',
  HTI = 'HTI',
  HUN = 'HUN',
  IDN = 'IDN',
  IMN = 'IMN',
  IND = 'IND',
  IOT = 'IOT',
  IRL = 'IRL',
  IRN = 'IRN',
  IRQ = 'IRQ',
  ISL = 'ISL',
  ISR = 'ISR',
  ITA = 'ITA',
  JAM = 'JAM',
  JEY = 'JEY',
  JOR = 'JOR',
  JPN = 'JPN',
  KAZ = 'KAZ',
  KEN = 'KEN',
  KGZ = 'KGZ',
  KHM = 'KHM',
  KIR = 'KIR',
  KNA = 'KNA',
  KOR = 'KOR',
  KWT = 'KWT',
  LAO = 'LAO',
  LBN = 'LBN',
  LBR = 'LBR',
  LBY = 'LBY',
  LCA = 'LCA',
  LIE = 'LIE',
  LKA = 'LKA',
  LSO = 'LSO',
  LTU = 'LTU',
  LUX = 'LUX',
  LVA = 'LVA',
  MAC = 'MAC',
  MAF = 'MAF',
  MAR = 'MAR',
  MCO = 'MCO',
  MDA = 'MDA',
  MDG = 'MDG',
  MDV = 'MDV',
  MEX = 'MEX',
  MHL = 'MHL',
  MKD = 'MKD',
  MLI = 'MLI',
  MLT = 'MLT',
  MMR = 'MMR',
  MNE = 'MNE',
  MNG = 'MNG',
  MNP = 'MNP',
  MOZ = 'MOZ',
  MRT = 'MRT',
  MSR = 'MSR',
  MTQ = 'MTQ',
  MUS = 'MUS',
  MWI = 'MWI',
  MYS = 'MYS',
  MYT = 'MYT',
  NAM = 'NAM',
  NCL = 'NCL',
  NER = 'NER',
  NFK = 'NFK',
  NGA = 'NGA',
  NIC = 'NIC',
  NIU = 'NIU',
  NLD = 'NLD',
  NOR = 'NOR',
  NPL = 'NPL',
  NRU = 'NRU',
  NZL = 'NZL',
  OMN = 'OMN',
  PAK = 'PAK',
  PAN = 'PAN',
  PCN = 'PCN',
  PER = 'PER',
  PHL = 'PHL',
  PLW = 'PLW',
  PNG = 'PNG',
  POL = 'POL',
  PRI = 'PRI',
  PRK = 'PRK',
  PRT = 'PRT',
  PRY = 'PRY',
  PSE = 'PSE',
  PYF = 'PYF',
  QAT = 'QAT',
  REU = 'REU',
  ROU = 'ROU',
  RUS = 'RUS',
  RWA = 'RWA',
  SAU = 'SAU',
  SDN = 'SDN',
  SEN = 'SEN',
  SGP = 'SGP',
  SGS = 'SGS',
  SHN = 'SHN',
  SJM = 'SJM',
  SLB = 'SLB',
  SLE = 'SLE',
  SLV = 'SLV',
  SMR = 'SMR',
  SOM = 'SOM',
  SPM = 'SPM',
  SRB = 'SRB',
  SSD = 'SSD',
  STP = 'STP',
  SUR = 'SUR',
  SVK = 'SVK',
  SVN = 'SVN',
  SWE = 'SWE',
  SWZ = 'SWZ',
  SXM = 'SXM',
  SYC = 'SYC',
  SYR = 'SYR',
  TCA = 'TCA',
  TCD = 'TCD',
  TGO = 'TGO',
  THA = 'THA',
  TJK = 'TJK',
  TKL = 'TKL',
  TKM = 'TKM',
  TLS = 'TLS',
  TON = 'TON',
  TTO = 'TTO',
  TUN = 'TUN',
  TUR = 'TUR',
  TUV = 'TUV',
  TWN = 'TWN',
  TZA = 'TZA',
  UGA = 'UGA',
  UKR = 'UKR',
  UMI = 'UMI',
  URY = 'URY',
  USA = 'USA',
  UZB = 'UZB',
  VAT = 'VAT',
  VCT = 'VCT',
  VEN = 'VEN',
  VGB = 'VGB',
  VIR = 'VIR',
  VNM = 'VNM',
  VUT = 'VUT',
  WLF = 'WLF',
  WSM = 'WSM',
  YEM = 'YEM',
  ZAF = 'ZAF',
  ZMB = 'ZMB',
  ZWE = 'ZWE'
}

export enum EDividendProceedsAction {
  HOLD = 'HOLD',
  SEND = 'SEND'
}

export enum EDividendProceedsSendFrequency {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY'
}

export enum EEmploymentStatus {
  EMPLOYED = 'EMPLOYED',
  RETIRED = 'RETIRED',
  STUDENT = 'STUDENT',
  UNEMPLOYED = 'UNEMPLOYED'
}

export enum EFeed {
  APEX = 'APEX',
  MORNING_STAR = 'MORNING_STAR'
}

export enum EInstrumentType {
  ETF = 'ETF',
  STOCK = 'STOCK'
}

export enum EInvestmentExperience {
  EXTENSIVE = 'EXTENSIVE',
  GOOD = 'GOOD',
  LIMITED = 'LIMITED',
  NONE = 'NONE'
}

export enum EInvestmentObjective {
  BALANCED = 'BALANCED',
  CAPITAL_PRESERVATION = 'CAPITAL_PRESERVATION',
  GROWTH = 'GROWTH',
  GROWTH_INCOME = 'GROWTH_INCOME',
  INCOME = 'INCOME',
  MAXIMUM_GROWTH = 'MAXIMUM_GROWTH',
  OTHER = 'OTHER',
  SPECULATION = 'SPECULATION'
}

export enum ELiquidityNeeds {
  NOT_IMPORTANT = 'NOT_IMPORTANT',
  SOMEWHAT_IMPORTANT = 'SOMEWHAT_IMPORTANT',
  VERY_IMPORTANT = 'VERY_IMPORTANT'
}

export enum ENetWorth {
  FROM_50001_TO_100000 = 'FROM_50001_TO_100000',
  FROM_100001_TO_200000 = 'FROM_100001_TO_200000',
  FROM_200001_TO_500000 = 'FROM_200001_TO_500000',
  FROM_500001_TO_1000000 = 'FROM_500001_TO_1000000',
  FROM_1000001_TO_5000000 = 'FROM_1000001_TO_5000000',
  OVER_5000001 = 'OVER_5000001',
  UNDER_50000 = 'UNDER_50000'
}

export enum EOrderListingType {
  COST = 'COST',
  EXECUTED = 'EXECUTED',
  LATEST = 'LATEST',
  OPEN = 'OPEN',
  TODAY = 'TODAY'
}

export enum EOrderStatus {
  ACCEPTED_AT_EXCHANGE = 'ACCEPTED_AT_EXCHANGE',
  CANCELLED = 'CANCELLED',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  PLACED = 'PLACED',
  REJECTED = 'REJECTED',
  UNKNOWN = 'UNKNOWN',
  WAITING_FOR_CANCELLATION = 'WAITING_FOR_CANCELLATION',
  WAITING_FOR_CANCEL_REPLACE = 'WAITING_FOR_CANCEL_REPLACE'
}

export enum EOrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT'
}

export enum ERiskTolerance {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

export enum ESecuritiesAction {
  HOLD_PROCEEDS = 'HOLD_PROCEEDS',
  SEND_PROCEEDS = 'SEND_PROCEEDS'
}

export enum ETimeHorizon {
  AVERAGE = 'AVERAGE',
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export enum ETransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum EUnsupportedAccountErrorReason {
  AFFILIATED_WITH_EXCHANGE_OR_FINRA = 'AFFILIATED_WITH_EXCHANGE_OR_FINRA',
  NON_CASH_ACCOUNT_TYPE = 'NON_CASH_ACCOUNT_TYPE',
  NON_DOMESTIC_ACCOUNT = 'NON_DOMESTIC_ACCOUNT',
  NON_US_CITIZEN = 'NON_US_CITIZEN',
  POLITICAL_OR_PUBLIC_PERSON = 'POLITICAL_OR_PUBLIC_PERSON',
  PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER = 'PUBLIC_COMPANY_10_PERCENT_SHARE_HOLDER'
}

export enum EValidationErrorCode {
  CHECK = 'CHECK',
  DUPLICATE = 'DUPLICATE',
  NULL = 'NULL',
  REFERENTIAL_INTEGRITY = 'REFERENTIAL_INTEGRITY'
}

export enum EVisaType {
  E1 = 'E1',
  E2 = 'E2',
  E3 = 'E3',
  F1 = 'F1',
  G4 = 'G4',
  H1B = 'H1B',
  L1 = 'L1',
  O1 = 'O1',
  TN1 = 'TN1'
}

export type InstrumentNameChangeInput = {
  exchangeName: Scalars['String'];
  newSymbol: Scalars['String'];
  oldSymbol: Scalars['String'];
};
