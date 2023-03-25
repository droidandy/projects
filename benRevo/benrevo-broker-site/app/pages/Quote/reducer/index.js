import {
  QuoteState,
  AlternativesReducer,
  CommonReducer,
  DocumentsReducer,
  EnrollmentRedcuer,
  OptionsReducer,
  OverviewReducer,
} from '@benrevo/benrevo-react-quote';
import { MatchReducer, MatchState } from '@benrevo/benrevo-react-match';
import { fromJS, Map, List } from 'immutable';
import { reducer as ModifiedCommonReducer } from './common';
import { reducer as ModifiedDisclosureReducer } from '../Disclosure/reducer';

export const initialState = {
  loading: false,
  loadingOptions: false,
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
    pnnId: null,
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
  planTypeTemplates: Map(),
  violationNotification: Map(),
  violationModalText: Map(),
  plansForDropDown: Map(),
  optionNameLoading: false,
};

const additionalState = fromJS({
  life: {
    ...initialState,
    types: ['LIFE'],
  },
  vol_life: {
    ...initialState,
    types: ['VOL_LIFE'],
  },
  std: {
    ...initialState,
    types: ['STD'],
  },
  vol_std: {
    ...initialState,
    types: ['VOL_STD'],
  },
  ltd: {
    ...initialState,
    types: ['LTD'],
  },
  vol_ltd: {
    ...initialState,
    types: ['VOL_LTD'],
  },
});
export const finalQuoteState = QuoteState.mergeDeep(MatchState).mergeDeep(additionalState);

function quoteReducer(state = finalQuoteState, action) {
  let finalState = state;

  finalState = AlternativesReducer(finalState, action);
  finalState = CommonReducer(finalState, action);
  finalState = DocumentsReducer(finalState, action);
  finalState = EnrollmentRedcuer(finalState, action);
  finalState = OptionsReducer(finalState, action);
  finalState = OverviewReducer(finalState, action);
  finalState = ModifiedCommonReducer(finalState, action);
  finalState = ModifiedDisclosureReducer(finalState, action);
  finalState = MatchReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
