import { fromJS, List, Map } from 'immutable';
import * as types from '../constants';

const informationState = {
  loading: false,
  updateDate: null,
  formErrors: Map({}),
  carriers: fromJS([{
    title: '',
    years: '',
  }]),
  previousCarriers: fromJS([{
    title: '',
    years: '',
  }]),
  payType: types.PERCENTAGE,
  commission: '',
  brokerOfRecord: 'yes',
  previousCarrier: 'yes',
  carrierList: List([]),
};

const lifeStdLtdState = {

  complete: false,
  submissionStatuses: fromJS([]),
  valid: fromJS({
    information: false,
    options: false,
    quote: false,
  }),

  /* Info */

  ...informationState,

  /* Options */

  maxClasses: 6,

  /* Quote */

  alternativeQuote: 'no',
  additionalRequests: '',

  /* Plans */

  rfpPlanNetworks: fromJS({}),
};

const ratesAdditionals = {
  addNewRangeFirstDisabled: true,
  addNewRangeLastDisabled: true,
  maxFirstIndex: 0,
  maxLastIndex: 9,
};

const initialState = {
  complete: false,
  attributes: fromJS({}),
  submissionStatuses: fromJS([]),
  valid: fromJS({
    information: false,
    options: false,
    contribution: false,
    quote: false,
  }),

  /* Info */

  ...informationState,

  /* Options */

  tier: 1,
  optionCount: 1,
  maxOptions: 6,

  /* Contribution */

  contributionType: types.PERCENTAGE,
  buyUp: 'no',
  lastUpdated: null,

  /* Plans */

  rfpPlanNetworks: fromJS({}),
  networksLoading: fromJS({}),
};

export const initialRfpMasterState = fromJS({
  common: Map({
    showErrors: false,
    rfpComplete: false,
    rfpCreated: false,
    requestError: false,
    plansLoaded: false,
    carriersLoaded: false,
    pendingSave: false,
  }),
  client: Map({
    formErrors: Map({}),
    complete: false,
    id: null,
  }),
  medical: Map({
    ...initialState,
    daysAfterHire: '',
    rateType: types.RATE_TYPE_COMPOSITE,
    planList: List([
      { value: 'HMO', text: 'HMO' },
      { value: 'PPO', text: 'PPO' },
      { value: 'HSA', text: 'HSA' },
    ]),
    plans: fromJS([createPlan(null, types.RFP_MEDICAL_SECTION, 1, 'HMO')]),
    tierList: [
      { value: 'N/A', text: 'N/A' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '4', text: '4' },
    ],
    selfFunding: 'no',
    alongside: false,
    takeOver: false,
    ratingTiers: 'N/A',
    diagnosisAndStatus: '',
    additionalRequests: '',
  }),
  dental: Map({
    ...initialState,
    planList: List([
      { value: 'DHMO', text: 'DHMO' },
      { value: 'DPPO', text: 'DPPO' },
    ]),
    plans: fromJS([createPlan(null, types.RFP_DENTAL_SECTION, 1, 'DHMO')]),
  }),
  vision: Map({
    ...initialState,
    planList: List([
      { value: 'VISION', text: 'VISION' },
    ]),
    plans: fromJS([createPlan(null, types.RFP_VISION_SECTION, 1, 'VISION')]),
  }),
  life: Map({
    ...lifeStdLtdState,
    basicPlan: createLifeStdLTdPlan(types.RFP_LIFE_SECTION, 'basicPlan'),
    voluntaryPlan: createLifeStdLTdPlan(types.RFP_LIFE_SECTION, 'voluntaryPlan'),
    ...ratesAdditionals,
  }),
  std: Map({
    ...lifeStdLtdState,
    basicPlan: createLifeStdLTdPlan(types.RFP_STD_SECTION, 'basicPlan'),
    voluntaryPlan: createLifeStdLTdPlan(types.RFP_STD_SECTION, 'voluntaryPlan'),
    ...ratesAdditionals,
  }),
  ltd: Map({
    ...lifeStdLtdState,
    eap: 'yes',
    visits: 1,
    basicPlan: createLifeStdLTdPlan(types.RFP_LTD_SECTION, 'basicPlan'),
    voluntaryPlan: createLifeStdLTdPlan(types.RFP_LTD_SECTION, 'voluntaryPlan'),
    ...ratesAdditionals,
  }),
  enrollment: fromJS({
    complete: false,
    lastUpdated: null,
    valid: {
      medical: false,
      dental: false,
      vision: false,
    },
  }),
  rates: fromJS({
    complete: false,
    lastUpdated: null,
    valid: {
      medical: false,
      dental: false,
      vision: false,
    },
  }),
});

export function createPlan(state, section, tiers, title) {
  const planTitle = (state) ? state.get(section).get('planList').first().text : title;
  const planTiers = (state) ? state.get(section).get('tier') : tiers;
  let plan = fromJS({
    rfpId: null,
    matchCurrent: true, // todo determine if these can be removed and use likeToMatchCurrent instead
    quoteAlt: true, // todo determine if these can be removed and use altQuote instead
    title: planTitle,
    name: '',
    outOfStateAmount: false,
    outOfStateCurrent: false,
    outOfStateRenewal: false,
    outOfStateEnrollment: false,
    contributionAmount: [],
    outOfStateAmountTiers: [],
    currentRates: [],
    outOfStateCurrentTiers: [],
    renewalRates: [],
    outOfStateRenewalTiers: [],
    contributionEnrollment: [],
    outOfStateContributionEnrollment: [],
    selectedCarrier: {},
    selectedNetwork: {},
  });

  if (section !== types.RFP_MEDICAL_SECTION) {
    plan = plan
      .set('likeToMatchCurrent', 'yes')
      .set('alternativeQuote', 'no')
      .set('additionalRequests', '');
  }

  if (section === types.RFP_MEDICAL_SECTION) {
    plan = plan
      .set('monthlyBandedPremium', { value: '' })
      .set('oufOfStateMonthlyBandedPremium', { value: '' })
      .set('monthlyBandedPremiumRenewal', { value: '' })
      .set('oufOfStateMonthlyBandedPremiumRenewal', { value: '' });
  }

  for (let i = 0; i < planTiers; i += 1) {
    plan = plan.merge({
      contributionAmount: plan.get('contributionAmount').push(Map({ value: '' })),
      currentRates: plan.get('currentRates').push(Map({ value: '' })),
      renewalRates: plan.get('renewalRates').push(Map({ value: '' })),
      contributionEnrollment: plan.get('contributionEnrollment').push(Map({ value: '' })),
      outOfStateAmountTiers: plan.get('outOfStateAmountTiers').push(Map({ value: '' })),
      outOfStateCurrentTiers: plan.get('outOfStateCurrentTiers').push(Map({ value: '' })),
      outOfStateRenewalTiers: plan.get('outOfStateRenewalTiers').push(Map({ value: '' })),
      outOfStateContributionEnrollment: plan.get('outOfStateContributionEnrollment').push(Map({ value: '' })),
    });
  }
  return plan;
}

export function createLifeStdLTdPlan(section, type) {
  const plan = fromJS({
    // added: false,
    added: true,
    ancillaryPlanId: null,
    carrierId: null,
    planName: null,
    planType: type === 'basicPlan' ? 'BASIC' : 'VOLUNTARY',
    planYear: 0,
    classes: [createLifeStdLTdPlanClass(section, type)],
    rates: createLifeStdLTdPlanRates(section, type),
  });

  return fromJS(plan);
}

export function createLifeStdLTdPlanClass(section, type) {
  if (section === types.RFP_LIFE_SECTION) {
    let data = fromJS({
      javaclass: 'LifeClassDto',
      name: '',
      waiverOfPremium: 'Yes',
      deathBenefit: 'Yes',
      conversion: 'Yes',
      portability: 'Yes',
      employeeBenefitAmount: '',
      employeeMaxBenefit: '',
      employeeGuaranteeIssue: '',
      ancillaryClassId: null,
      percentage: '',
      age65reduction: '',
      age70reduction: '',
      age75reduction: '',
      age80reduction: '',
    });

    if (type === 'voluntaryPlan') {
      data = data
        .set('spouseBenefitAmount', '')
        .set('spouseMaxBenefit', '')
        .set('spouseGuaranteeIssue', '')
        .set('childBenefitAmount', '')
        .set('childMaxBenefit', '')
        .set('childGuaranteeIssue', '');
    }

    return data;
  } else if (section === types.RFP_STD_SECTION) {
    let data = fromJS({
      javaclass: 'StdClassDto',
      name: '',
      ancillaryClassId: null,
      waitingPeriodAccident: null,
      waitingPeriodSickness: null,
      weeklyBenefit: '',
      maxWeeklyBenefit: '',
      maxBenefitDuration: '',
    });

    if (type === 'voluntaryPlan') {
      data = data.set('conditionExclusion', '').set('conditionExclusionOther', '');
    }

    return data;
  } else if (section === types.RFP_LTD_SECTION) {
    return fromJS({
      javaclass: 'LtdClassDto',
      name: '',
      ancillaryClassId: null,
      eliminationPeriod: null,
      conditionExclusion: '',
      conditionExclusionOther: '',
      occupationDefinition: '',
      occupationDefinitionOther: '',
      abuseLimitation: '',
      abuseLimitationOther: '',
      // waiverOfPremium: 'yes',
      premiumsPaid: 'Pre-tax',
      monthlyBenefit: '',
      maxBenefit: '',
      maxBenefitDuration: '',
    });
  }

  return null;
}

export function createLifeStdLTdPlanRates(section, type) {
  const createAges = () => [
    createLifeStdLTdPlanAgeRates(section, 0, 29),
    createLifeStdLTdPlanAgeRates(section, 30, 34),
    createLifeStdLTdPlanAgeRates(section, 35, 39),
    createLifeStdLTdPlanAgeRates(section, 40, 44),
    createLifeStdLTdPlanAgeRates(section, 45, 49),
    createLifeStdLTdPlanAgeRates(section, 50, 54),
    createLifeStdLTdPlanAgeRates(section, 55, 59),
    createLifeStdLTdPlanAgeRates(section, 60, 64),
    createLifeStdLTdPlanAgeRates(section, 65, 69),
    createLifeStdLTdPlanAgeRates(section, 70, null),
  ];
  if (section === types.RFP_LIFE_SECTION) {
    let data = {};

    if (type === 'basicPlan') {
      data = {
        javaclass: 'BasicRateDto',
        ancillaryRateId: null,
        volume: null,
        currentLife: null,
        renewalLife: null,
        currentADD: null,
        renewalADD: null,
      };
    } else {
      data = {
        javaclass: 'VoluntaryRateDto',
        ancillaryRateId: null,
        employee: true,
        employeeTobacco: true,
        spouse: true,
        spouseBased: 'Employee Age',
        rateEmpADD: null,
        rateSpouseADD: null,
        rateChildLife: null,
        rateChildADD: null,
        volume: null,
        monthlyCost: null,
        rateGuarantee: null,
        ages: createAges(),
      };
    }
    return data;
  }

  let data = {};

  if (type === 'basicPlan') {
    data = {
      javaclass: 'BasicRateDto',
      ancillaryRateId: null,
      volume: null,
      currentSL: null,
      renewalSL: null,
    };
  } else {
    data = {
      javaclass: 'VoluntaryRateDto',
      ancillaryRateId: null,
      volume: null,
      monthlyCost: null,
      rateGuarantee: null,
      ages: createAges(),
    };
  }
  return data;
}

export function createLifeStdLTdPlanAgeRates(section, from, to) {
  if (section === types.RFP_LIFE_SECTION) {
    return { from, to, currentEmp: null, currentEmpTobacco: null, currentSpouse: null, renewalEmp: null, renewalEmpTobacco: null, renewalSpouse: null };
  }

  return { from, to, currentEmp: null, renewalEmp: null };
}

export function checkButtonAddStatus(ages, index) {
  let countFirst = 0;
  let countLast = 0;
  let maxFirstIndex = 0;
  let maxLastIndex = 0;
  const flag = { addNewRangeFirstDisabled: true, addNewRangeLastDisabled: true, maxFirstIndex: 0, maxLastIndex: 0 };
  ages.forEach((age, ind) => {
    if (age.from < 30) {
      countFirst += 1;
      maxFirstIndex = ind;
    }
    if (age.from > 30) {
      countLast += 1;
      maxLastIndex = ind;
    }
  });
  // if we can't add row in the first block
  if (index < 8) {
    flag.addNewRangeFirstDisabled = (ages[maxFirstIndex].to > 27 || !ages[maxFirstIndex].to || countFirst === 5);
  }
  // if we can't add row in the last block
  if (index > 8) {
    flag.addNewRangeLastDisabled = (ages[maxLastIndex].to > 98 || !ages[maxLastIndex].to || countLast === 5);
  }
  flag.maxFirstIndex = maxFirstIndex;
  flag.maxLastIndex = maxLastIndex;
  // console.log('flag = ', flag.addNewRangeFirstDisabled, flag.addNewRangeLastDisabled);
  // console.log('ind = ', index, ages[maxFirstIndex].to, countFirst, ages[maxLastIndex].to, countLast);
  return flag;
}

const state = initialRfpMasterState;

export default state;
