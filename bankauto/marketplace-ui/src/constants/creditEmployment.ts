import { SelectOption } from '@marketplace/ui-kit/components/Select';

export const PROOF_CREDIT_SUM = 10 ** 6;

export enum EmploymentType {
  WAGE = '1',
  MILITARY = '2',
  PENSIONER = '3',
  ENTREPRENEUR = '4',
  BUSINESS = '5',
  LAWYER = '6',
  NOTARY = '7',
}

export enum EmploymentTypeFis {
  WAGE = 'employee',
  MILITARY = 'military_personnel',
  PENSIONER = 'retiree',
  ENTREPRENEUR = 'individual_entrepreneur',
  BUSINESS = 'businessman',
  LAWYER = 'lawyer',
  NOTARY = 'notary',
}

export enum CurrentJobCategory {
  OWNER = '1',
  ENTREPRENEUR = '2',
  PRIVATE = '3',
  COMPANY_HEAD = '4',
  DEPARTMENT_MANAGER = '5',
  SPECIALIST = '6',
  AMATEUR = '7',
  NO = '8',
}

export enum SupportingDocument {
  /** 2-НДФЛ */
  NFDL2 = '1',
  /** Справка по форме Банка */
  BANK_FORM_REFERENCE = '2',
  /** Выписка из ПФР */
  PFR_STATEMENT = '3',
  /** Выписка по счёту в другом Банке */
  ACCOUNT_STATEMENT_IN_ANOTHER_BANK = '4',
  /** 3-НДФЛ */
  NDFL3 = '5',
  /** Без подтверждающего документа */
  NO = '6',
  /** Декларация по УСН */
  USN_DECLARATION = '7',
  /** Декларация по ЕНВД */
  ENVD_DECLARATION = '8',
  /** Декларация по ЕСХН */
  ESHN_DECLARATION = '9',
}

export enum SupportingDocumentFis {
  /** 2-НДФЛ */
  NFDL2 = 'ndfl2',
  /** Справка по форме Банка */
  BANK_FORM_REFERENCE = 'bank_app_form',
  /** Выписка из ПФР */
  PFR_STATEMENT = 'pfr',
  /** Выписка по счёту в другом Банке */
  ACCOUNT_STATEMENT_IN_ANOTHER_BANK = 'account_statements',
  /** 3-НДФЛ */
  NDFL3 = 'ndfl3',
  /** Без подтверждающего документа */
  NO = 'without_verification',
  /** Декларация по УСН */
  USN_DECLARATION = 'usn',
  /** Декларация по ЕНВД */
  ENVD_DECLARATION = 'envd',
  /** Декларация по ЕСХН */
  ESHN_DECLARATION = 'eshn',
  /** ЗП начисления РГСБ */
  RGSB_SALARY = 'rgsb_salary',
}

export enum AdditionalIncomeType {
  PENSION = '1',
  ALIMONY = '2',
  RENTAL = '3',
  DIVIDENDS = '4',
  DEPOSITS = '5',
  OTHER = '6',
}

export const organisationActivityOptions = [
  { label: 'Армия, МВД, ФСБ и иные силовые ведомства', value: '1' },
  { label: 'Информационные технологии / телекоммуникации', value: '2' },
  { label: 'Консалтинговые услуги', value: '3' },
  { label: 'Медицина', value: '4' },
  { label: 'Наука', value: '5' },
  { label: 'Образование', value: '6' },
  { label: 'Общественное питание', value: '7' },
  { label: 'Оптовая и розничная торговля', value: '8' },
  { label: 'Органы власти и управление', value: '9' },
  { label: 'Пищевая промышленность', value: '10' },
  { label: 'Промышленность и машиностроение', value: '11' },
  { label: 'Сельское хозяйство / животноводство', value: '12' },
  { label: 'Социальная сфера', value: '13' },
  { label: 'Строительство', value: '14' },
  { label: 'Топливно-энергетический комплекс', value: '15' },
  { label: 'Транспорт', value: '16' },
  { label: 'Туризм', value: '17' },
  { label: 'Услуги', value: '18' },
  { label: 'Финансы, банки, страхование', value: '19' },
  { label: 'Другие отрасли', value: '20' },
  { label: 'Отсутсвует', value: '21' },
];

export const employmentTypeOptions = [
  { label: 'Работа по найму', value: EmploymentType.WAGE },
  { label: 'Военнослужащий', value: EmploymentType.MILITARY },
  { label: 'Пенсионер', value: EmploymentType.PENSIONER },
  { label: 'Индивидуальный предприниматель', value: EmploymentType.ENTREPRENEUR },
  { label: 'Собственный бизнес', value: EmploymentType.BUSINESS },
  { label: 'Частная практика — адвокат', value: EmploymentType.LAWYER },
  { label: 'Частная практика — нотариус', value: EmploymentType.NOTARY },
];

export const employmentTypeFisOptions = [
  { label: 'Работа по найму', value: EmploymentTypeFis.WAGE },
  { label: 'Военнослужащий', value: EmploymentTypeFis.MILITARY },
  { label: 'Пенсионер', value: EmploymentTypeFis.PENSIONER },
  { label: 'Индивидуальный предприниматель', value: EmploymentTypeFis.ENTREPRENEUR },
  { label: 'Собственный бизнес', value: EmploymentTypeFis.BUSINESS },
  { label: 'Частная практика — адвокат', value: EmploymentTypeFis.LAWYER },
  { label: 'Частная практика — нотариус', value: EmploymentTypeFis.NOTARY },
];

export const currentJobExperienceOptions = [
  { label: 'До 3 месяцев', value: '1' },
  { label: 'От 3 до 6 месяцев', value: '2' },
  { label: 'От 6 до 12 месяцев', value: '3' },
  { label: 'Более одного года', value: '4' },
];

export const professionOptions = [
  { label: 'ИТ', value: '1' },
  { label: 'Военная служба', value: '2' },
  { label: 'Государственная/муниципальная служба', value: '3' },
  { label: 'Журналистика', value: '4' },
  { label: 'Медицинская', value: '5' },
  { label: 'Образовательная', value: '6' },
  { label: 'Обслуживающий персонал', value: '7' },
  { label: 'Общая административная', value: '8' },
  { label: 'Охрана и безопасность', value: '9' },
  { label: 'Продажи', value: '10' },
  { label: 'Прочая гуманитарная', value: '11' },
  { label: 'Сельско-хозяйственная', value: '12' },
  { label: 'Сфера услуг', value: '13' },
  { label: 'Творческая', value: '14' },
  { label: 'Техническая (строительство, промышленность, производство)', value: '15' },
  { label: 'Транспортная', value: '16' },
  { label: 'Экономическая', value: '17' },
  { label: 'Юридическая', value: '18' },
  { label: 'Отсутсвует', value: '19' },
  { label: 'Прочее', value: '20' },
];

export const currentJobCategoryOptions = [
  // { label: 'Собственник / Учредитель', value: CurrentJobCategory.OWNER },
  // { label: 'Индивидуальный предприниматель', value: CurrentJobCategory.ENTREPRENEUR },
  // { label: 'Частная практика', value: CurrentJobCategory.PRIVATE },
  { label: 'Руководитель компании (первое лицо компании)', value: CurrentJobCategory.COMPANY_HEAD },
  { label: 'Руководитель внутреннего структурного подразделения', value: CurrentJobCategory.DEPARTMENT_MANAGER },
  { label: 'Квалифицированный специалист', value: CurrentJobCategory.SPECIALIST },
  { label: 'Специалист без квалификации', value: CurrentJobCategory.AMATEUR },
  { label: 'Отсутствует', value: CurrentJobCategory.NO },
];

export const additionalIncomeTypeOptions = [
  { label: 'Пенсия', value: AdditionalIncomeType.PENSION },
  { label: 'Алименты', value: AdditionalIncomeType.ALIMONY },
  { label: 'Сдача в аренду', value: AdditionalIncomeType.RENTAL },
  { label: 'Дивиденды', value: AdditionalIncomeType.DIVIDENDS },
  { label: 'Вклады', value: AdditionalIncomeType.DEPOSITS },
  { label: 'Иное', value: AdditionalIncomeType.OTHER },
];

export const ProofDocumentType: Record<string, SelectOption> = {
  ndfl2: { label: '2-НДФЛ', value: SupportingDocument.NFDL2 },
  bankFormReference: { label: 'Справка по форме Банка', value: SupportingDocument.BANK_FORM_REFERENCE },
  pfrStatement: { label: 'Выписка из ПФР', value: SupportingDocument.PFR_STATEMENT },
  accountStatementInAnotherBank: {
    label: 'Выписка по счёту в другом Банке',
    value: SupportingDocument.ACCOUNT_STATEMENT_IN_ANOTHER_BANK,
  },
  ndfl3: { label: '3-НДФЛ', value: SupportingDocument.NDFL3 },
  no: { label: 'Без подтверждающего документа', value: SupportingDocument.NO },
  usnDeclaration: { label: 'Декларация по УСН', value: SupportingDocument.USN_DECLARATION },
  envdDeclaration: { label: 'Декларация по ЕНВД', value: SupportingDocument.ENVD_DECLARATION },
  eshnDeclaration: { label: 'Декларация по ЕСХН', value: SupportingDocument.ESHN_DECLARATION },
};

export const ProofDocumentTypeFis: Record<string, SelectOption> = {
  ndfl2: { label: '2-НДФЛ', value: SupportingDocumentFis.NFDL2 },
  bankFormReference: { label: 'Справка по форме Банка', value: SupportingDocumentFis.BANK_FORM_REFERENCE },
  pfrStatement: { label: 'Выписка из ПФР', value: SupportingDocumentFis.PFR_STATEMENT },
  accountStatementInAnotherBank: {
    label: 'Выписка по счёту в другом Банке',
    value: SupportingDocumentFis.ACCOUNT_STATEMENT_IN_ANOTHER_BANK,
  },
  ndfl3: { label: '3-НДФЛ', value: SupportingDocument.NDFL3 },
  no: { label: 'Без подтверждающего документа', value: SupportingDocumentFis.NO },
  usnDeclaration: { label: 'Декларация по УСН', value: SupportingDocumentFis.USN_DECLARATION },
  envdDeclaration: { label: 'Декларация по ЕНВД', value: SupportingDocumentFis.ENVD_DECLARATION },
  eshnDeclaration: { label: 'Декларация по ЕСХН', value: SupportingDocumentFis.ESHN_DECLARATION },
  rgsbSalary: { label: 'ЗП начисления РГСБ', value: SupportingDocumentFis.RGSB_SALARY },
};

export const proofDocumentTypeOptions = {
  [EmploymentType.WAGE]: [
    ProofDocumentType.no,
    ProofDocumentType.ndfl2,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.accountStatementInAnotherBank,
  ],
  [EmploymentType.MILITARY]: [
    ProofDocumentType.no,
    ProofDocumentType.ndfl2,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.accountStatementInAnotherBank,
  ],
  [EmploymentType.PENSIONER]: [
    ProofDocumentType.no,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
  ],
  [EmploymentType.ENTREPRENEUR]: [
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.no,
    ProofDocumentType.usnDeclaration,
    ProofDocumentType.eshnDeclaration,
    ProofDocumentType.envdDeclaration,
  ],
  [EmploymentType.BUSINESS]: [
    ProofDocumentType.ndfl2,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.no,
  ],
  [EmploymentType.LAWYER]: [
    ProofDocumentType.no,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.envdDeclaration,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.usnDeclaration,
  ],
  [EmploymentType.NOTARY]: [
    ProofDocumentType.no,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.envdDeclaration,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.usnDeclaration,
  ],
};

export const proofDocumentSimpleCreditTypeOptions = {
  [EmploymentType.WAGE]: [
    ProofDocumentType.ndfl2,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.no,
  ],
  [EmploymentType.MILITARY]: [
    ProofDocumentType.ndfl2,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.no,
  ],
  [EmploymentType.PENSIONER]: [
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.no,
  ],
  [EmploymentType.ENTREPRENEUR]: [
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.no,
    ProofDocumentType.usnDeclaration,
    ProofDocumentType.envdDeclaration,
    ProofDocumentType.eshnDeclaration,
  ],
  [EmploymentType.BUSINESS]: [
    ProofDocumentType.ndfl2,
    ProofDocumentType.bankFormReference,
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.no,
  ],
  [EmploymentType.LAWYER]: [
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.no,
    ProofDocumentType.usnDeclaration,
    ProofDocumentType.envdDeclaration,
  ],
  [EmploymentType.NOTARY]: [
    ProofDocumentType.pfrStatement,
    ProofDocumentType.accountStatementInAnotherBank,
    ProofDocumentType.ndfl3,
    ProofDocumentType.no,
    ProofDocumentType.usnDeclaration,
    ProofDocumentType.envdDeclaration,
  ],
};

export const proofDocumentTypeFisOptions = {
  [EmploymentTypeFis.WAGE]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl2,
    ProofDocumentTypeFis.bankFormReference,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.rgsbSalary,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
  ],
  [EmploymentTypeFis.MILITARY]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl2,
    ProofDocumentTypeFis.bankFormReference,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.rgsbSalary,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
  ],
  [EmploymentTypeFis.PENSIONER]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
  ],
  [EmploymentTypeFis.ENTREPRENEUR]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl3,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
    ProofDocumentTypeFis.usnDeclaration,
    ProofDocumentTypeFis.envdDeclaration,
    ProofDocumentTypeFis.eshnDeclaration,
  ],
  [EmploymentTypeFis.BUSINESS]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl2,
    ProofDocumentTypeFis.bankFormReference,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
  ],
  [EmploymentTypeFis.LAWYER]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl3,
    ProofDocumentTypeFis.bankFormReference,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
    ProofDocumentTypeFis.usnDeclaration,
    ProofDocumentTypeFis.envdDeclaration,
  ],
  [EmploymentTypeFis.NOTARY]: [
    ProofDocumentTypeFis.no,
    ProofDocumentTypeFis.ndfl3,
    ProofDocumentTypeFis.bankFormReference,
    ProofDocumentTypeFis.pfrStatement,
    ProofDocumentTypeFis.accountStatementInAnotherBank,
    ProofDocumentTypeFis.usnDeclaration,
    ProofDocumentTypeFis.envdDeclaration,
  ],
};

export const militaryFormConstants = {
  employerActivity: '1',
  currentJobPosition: '51',
  profession: '2',
};

export const ENTERPRENEUR_JOB_POSITION = '375'; // Руководитель
export const ENTERPRENEUR_PROFESSION = '19'; // Отсутствует

export const EMPLOYMENT_TYPE_FIELDS_MAP: Record<string, Record<string, string>> = {
  [EmploymentType.MILITARY]: {
    employerActivity: militaryFormConstants.employerActivity,
    currentJobCategory: CurrentJobCategory.NO,
    currentJobPosition: militaryFormConstants.currentJobPosition,
    profession: militaryFormConstants.profession,
  },
  [EmploymentType.ENTREPRENEUR]: {
    currentJobCategory: CurrentJobCategory.ENTREPRENEUR,
    currentJobPosition: ENTERPRENEUR_JOB_POSITION,
    profession: ENTERPRENEUR_PROFESSION,
  },
  [EmploymentType.BUSINESS]: {
    currentJobCategory: CurrentJobCategory.OWNER,
  },
  [EmploymentType.LAWYER]: {
    currentJobCategory: CurrentJobCategory.PRIVATE,
  },
  [EmploymentType.NOTARY]: {
    currentJobCategory: CurrentJobCategory.PRIVATE,
  },
};

export const militaryFormFisConstants = {
  employerActivity: '1',
  currentJobPosition: 'Военнослужащий',
  profession: '2',
};

export const EMPLOYMENT_TYPE_FIELDS_FIS_MAP: Record<string, Record<string, string>> = {
  [EmploymentTypeFis.MILITARY]: {
    employerActivity: militaryFormFisConstants.employerActivity,
    currentJobCategory: CurrentJobCategory.NO,
    currentJobPosition: militaryFormFisConstants.currentJobPosition,
    profession: militaryFormFisConstants.profession,
  },
  [EmploymentTypeFis.ENTREPRENEUR]: {
    currentJobCategory: CurrentJobCategory.ENTREPRENEUR,
    currentJobPosition: ENTERPRENEUR_JOB_POSITION,
    profession: ENTERPRENEUR_PROFESSION,
  },
  [EmploymentTypeFis.BUSINESS]: {
    currentJobCategory: CurrentJobCategory.OWNER,
  },
  [EmploymentTypeFis.LAWYER]: {
    currentJobCategory: CurrentJobCategory.PRIVATE,
  },
  [EmploymentTypeFis.NOTARY]: {
    currentJobCategory: CurrentJobCategory.PRIVATE,
  },
};
