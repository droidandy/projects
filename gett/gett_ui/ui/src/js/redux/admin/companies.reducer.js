import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  list: {
    items: [],
    countryCodeFilterOptions: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    query: {
      search: ''
    },
    can: {},
  },
  edit: { // defaults for a new company
    name: '',
    companyType: 'enterprise',
    bookingFee: 1.5,
    runInFee: 1,
    handlingFee: 20,
    phoneBookingFee: 1,
    tips: 10,
    cancellationBeforeArrivalFee: 0,
    cancellationAfterArrivalFee: 0,
    gettCancellationBeforeArrivalFee: 0,
    gettCancellationAfterArrivalFee: 0,
    getECancellationBeforeArrivalFee: 0,
    getECancellationAfterArrivalFee: 0,
    splytCancellationBeforeArrivalFee: 0,
    splytCancellationAfterArrivalFee: 0,
    careyCancellationBeforeArrivalFee: 0,
    careyCancellationAfterArrivalFee: 0,
    quotePriceIncreasePercentage: 0,
    quotePriceIncreasePounds: 0,
    internationalBookingFee: 0,
    systemFxRateIncreasePercentage: 0,
    defaultDriverMessage: '',
    bookerNotifications: true,
    multipleBooking: true,
    address: {
      line: ''
    },
    ddi: {
      type: 'standard'
    },
    paymentOptions: {
      paymentTypes: ['account', 'passenger_payment_card'],
      invoicingSchedule: 'monthly',
      paymentTerms: 30
    },
    references: [],
    admin: {
      onboarding: null,
      email: ''
    }
  },
  form: {
    users: [],
    companies: [],
    countries: [],
    can: {}
  },
  currentStats: {
    countByStatusMonthly: [],
    countByStatusDaily: [],
    countByVehicleNameMonthly: [],
    countByVehicleNameDaily: [],
    countByPaymentTypeMonthly: [],
    countByPaymentTypeDaily: [],
    spendMonthly: [],
    spendDaily: [],
    creditRateMonthly: [],
    creditRateDaily: [],
    completedByOrderType: [],
    outstandingBalance: 0
  },
  comments: []
};

export default reduce('companies', initialState, (reducer) => {
  reducer('setQuery', (state, query) => {
    if (query && query !== state.list.query) {
      return update(state, 'list.query', query);
    }
    return state;
  });

  reducer('getCompaniesSuccess', (state, data) => {
    return update.assign(state, 'list', data);
  });

  reducer('getUsersSuccess', (state, users) => {
    return update(state, 'form.users', users);
  });

  reducer('buildCompany', (state) => {
    return { ...state, edit: { ...initialState.edit } };
  });

  reducer('getCompanyForEditSuccess', (state, { company, users, countries, companies, can }) => {
     const edit = company || initialState.edit;

     return { ...state, edit, form: { users, countries, companies, can } };
   });

  reducer('toggleCompanyStatusSuccess', (state, id) => {
    return update.with(state, `list.items.{id:${id}}.active`, active => !active);
  });

  reducer('activateAllMembersSuccess', (state, id) => {
    return update(state, `list.items.{id:${id}}.inactiveMembersCount`, 0);
  });

  reducer('getStats', (state) => {
    return { ...state, currentStats: initialState.currentStats };
  });

  reducer('getStatsSuccess', (state, currentStats) => {
    return { ...state, currentStats };
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return { ...state, changeLog };
  });

  reducer('getCommentsSuccess', (state, comments) => {
    return { ...state, comments };
  });

  reducer('addComment', (state, companyId, comment) => {
    const nextState = update.add(state, 'comments', comment);
    return update.in.with(nextState, `list.items.{id:${companyId}}.commentsCount`, count => count + 1);
  });

  reducer('getPricingRulesSuccess', (state, pricingRules) => {
    return { ...state, pricingRules };
  });

  reducer('togglePricingRuleStatusSuccess', (state, rule) => {
    return update(state, `pricingRules.{id:${rule.id}}.active`, rule.active);
  });
});
