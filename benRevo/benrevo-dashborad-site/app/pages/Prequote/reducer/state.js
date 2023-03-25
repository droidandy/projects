import { fromJS, Map, List } from 'immutable';
import { RfpReducerState, ATTR_KAISER_OR_SIMNSA, DOLLARS } from '@benrevo/benrevo-react-rfp';
import RXHMO from '../Plans/RXHMO';
import HMO from '../Plans/HMO';
import DPPO from '../Plans/DPPO';
import VISION from '../Plans/Vision';

export const additionalState = fromJS({
  loading: false,
  loadingOptimizer: false,
  rater: {
    sending: false,
    raters: [],
    history: [],
    sent: false,
    selectedRater: null,
    note: '',
  },
  bank: {
    sent: false,
    sending: false,
    rateBank: {},
    editedBudgetInputs: Map({}),
    editedTableInputs: Map({}),
    history: [],
  },
  match: {
    creatingPlans: false,
  },
  send: {
    sent: false,
    sending: false,
    medicalQuote: {},
    kaiserQuote: {},
    dentalQuote: {},
    visionQuote: {},
    lifeQuote: {},
    summaries: {},
    clientMembers: [],
    summaryLoaded: false,
    premiumCredit: 0,
    projectedBundleDiscount: 0,
    projectedBundleDiscountPercent: 0,
    totalAnnualPremium: 0,
    totalAnnualPremiumWithDiscount: 0,
    medicalDiscount: false,
    dentalDiscount: false,
    visionDiscount: false,
    lifeDiscount: false,
  },
  clientInfo: Map({
    clientSaveInProgress: false,
    brokerages: List([]),
    brokerContacts: List([]),
    filteredbrokerContacts: List([]),
    filteredGAContacts: List([]),
    GA: List([]),
    GAContacts: List([]),
    loading: false,
    selectedBC: List([]),
    deletedBC: List([]),
    selectedGAC: List([]),
    deletedGAC: List([]),
    newBroker: Map({
      values: Map({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      }),
      readyToSave: false,
    }),
    producer: fromJS({
      name: '',
    }),
    selectedBroker: null,
    selectedGA: null,
    newBrokerContacts: List([
      {
        email: null,
        brokerageId: null,
      },
    ]),
    newGAContacts: List([
      {
        email: null,
        brokerageId: null,
      },
    ]),
  }),
  medical: Map({
    payType: DOLLARS,
    attributes: fromJS({
      [ATTR_KAISER_OR_SIMNSA]: 'N/A',
    }),
    benefits: fromJS([{ ...HMO, rx: [...RXHMO.benefits] }]),
    valid: fromJS({
      information: false,
      contribution: false,
      rates: false,
      enrollment: false,
      uw: true,
      benefits: true,
      quote: true,
      options: true,
    }),
  }),
  dental: Map({
    payType: DOLLARS,
    benefits: fromJS([{ ...DPPO }]),
    selectedBenefits: fromJS({}),
    valid: fromJS({
      information: false,
      contribution: false,
      rates: false,
      enrollment: false,
      benefits: true,
      quote: true,
      options: true,
    }),
  }),
  uploadQuote: Map({
    files: List([]),
    isLoadingQuote: false,
    errors: List([]),
    errorsModal: false,
    standart: Map({}),
    kaiser: Map({}),
    receivedQuotes: List([]),
  }),
  vision: Map({
    payType: DOLLARS,
    benefits: fromJS([{ ...VISION }]),
    valid: fromJS({
      information: false,
      contribution: false,
      rates: false,
      enrollment: false,
      quote: true,
      options: true,
    }),
  }),
});

export default RfpReducerState.mergeDeep(additionalState);
