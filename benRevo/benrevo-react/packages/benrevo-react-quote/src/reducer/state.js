import { fromJS, Map, List } from 'immutable';

export const initialState = {
  loading: false,
  loadingAfterSelect: false,
  loadingOptions: false,
  addingNetworks: false,
  medicalGroups: List(),
  medicalGroupsColumns: Map(),
  plansGetSuccess: false,
  plansGetError: false,
  alternativesLoading: false,
  currentOption: Map(),
  //
  planTemplate: Map(),
  allPlans: List(),
  alternativePlans: List(),
  altPlan: Map(),
  currentPlan: Map(),
  selectedPlan: Map(),
  matchPlan: Map(),
  //
  page: fromJS({
    currentPage: 'Options',
    readOnly: false,
    id: null,
    index: null,
    carrier: {},
    options: {},
    optionType: '',
  }),
  alternativesPlans: fromJS({
    plans: List(),
  }),
  stateAlternativesPlans: fromJS({
    plans: [],
    rx: [],
  }),
  newPlan: Map({
    nameByNetwork: '',
    rfpQuoteNetworkId: '',
    type: 'alternative',
    selected: false,
    benefits: [],
    cost: [],
    rx: [],
  }),
  rows: [],
  openedOption: fromJS({
    totalAnnualPremium: 0,
    percentDifference: 0,
    dollarDifference: 0,
    overviewPlans: [],
    detailedPlans: [],
  }),
  openedOptionContributions: fromJS([]),
  contributionsEdit: fromJS({}),
  contributionsBase: fromJS({}),
  openedOptionRider: fromJS({
    networkRidersDtos: [],
  }),
  riderFees: fromJS([]),
  checkedOptions: List(),
  compareOptions: fromJS([]),
  compareNetworks: fromJS({}),
  mainCarrier: fromJS({
    carrier: {},
  }),
  clearValueCarrier: fromJS({
    carrier: {},
  }),
  kaiserCarrier: fromJS({
    carrier: {},
  }),
  carrierList: List([]),
  current: Map({
    carrier: {},
  }),
  quotes: fromJS([]),
  options: fromJS([]),
  networks: fromJS([]),
  selected: 0,
  selectedOptionName: '',
  selectedPlans: [],
  totalPlans: 0,
  load: Map({
    options: true,
    overview: true,
    alternatives: true,
    compare: true,
  }),
  enrollment: fromJS({}),
  enrollmentEdit: false,
  enrollmentBase: fromJS({}),
  quotesStatus: fromJS([]),
  filter: Map({
    diffPercentFrom: null,
    diffPercentTo: null,
    copayFrom: null,
    copayTo: null,
    deductibleFrom: null,
    deductibleTo: null,
    coinsuranceFrom: null,
    coinsuranceTo: null,
  }),
  minMaxVals: Map({
    minCopay: null,
    maxCopay: null,
    minCoinsurance: null,
    maxCoinsurance: null,
  }),
};

export const initialPresentationMasterState = fromJS({
  disclaimer: fromJS({
    disclosures: {
      ANTHEM_BLUE_CROSS: {},
      ANTHEM_CLEAR_VALUE: {},
      UHC: {},
    },
  }),
  quote: fromJS({
    ...initialState,
    errMsg: 'Dang! An error occurred. Please refresh and try again.',
    err: false,
    loading: false,
    quoteProducts: List(),
    client: fromJS({}),
    readonly: false,
    qualification: {},
    qualificationLoading: false,
  }),
  documents: fromJS({
    loading: false,
    data: List(),
  }),
  medical: Map({
    ...initialState,
  }),
  dental: Map({
    ...initialState,
  }),
  vision: Map({
    ...initialState,
  }),
  life: Map({
    ...initialState,
  }),
  vol_life: Map({
    ...initialState,
  }),
  std: Map({
    ...initialState,
  }),
  vol_std: Map({
    ...initialState,
  }),
  ltd: Map({
    ...initialState,
  }),
  vol_ltd: Map({
    ...initialState,
  }),
  enrollment: Map({
    loading: false,
    load: Map({
      enrollment: true,
    }),
  }),
  final: Map({
    load: Map({
      final: true,
    }),
    loading: false,
    submittedDate: null,
    externalProducts: fromJS({
      LIFE: false,
      STD: false,
      LTD: false,
      SUPP_LIFE: false,
      STD_LTD: false,
      HEALTH: false,
    }),
    showSubmitSuccess: false,
    totalAll: 0,
    subTotalAnnualCost: 0,
    summaryBundleDiscount: 0,
    dentalBundleDiscount: 0,
    dentalBundleDiscountPercent: 0,
    dentalBundleDiscountApplied: false,
    visionBundleDiscount: 0,
    visionBundleDiscountPercent: 0,
    visionBundleDiscountApplied: false,
    medicalWithoutKaiserTotal: 0,
    dentalRenewalDiscountPenalty: null,
    visionRenewalDiscountPenalty: null,
    extendedBundleDiscount: fromJS({
      LIFE: null,
      STD: null,
      LTD: null,
    }),
  }),
});
